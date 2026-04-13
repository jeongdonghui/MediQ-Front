import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Animated,
  PanResponder
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Bottom Sheet Heights
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.6;
const BOTTOM_SHEET_MIN_HEIGHT = 120;
const MAX_TRANSLATE_Y = BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT;

export default function KakaoMapScreen() {
  const KAKAO_JS_KEY = 'e65778b5fc9d1b60e914f2dcacef74df';
  const KAKAO_REST_KEY = '80d6bbaa7590809cad13bf740446b4cc';
  const navigation = useNavigation();
  const webviewRef = useRef<WebView>(null);

  const [hasAlarm, setHasAlarm] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<any | null>(null);

  // New States for UX improvements
  const [isPermissionChecked, setIsPermissionChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showReSearchBtn, setShowReSearchBtn] = useState(false);

  // Bottom Sheet Animation
  const panY = useRef(new Animated.Value(MAX_TRANSLATE_Y)).current;

  const expandSheet = () => {
    Animated.timing(panY, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };
  const collapseSheet = () => {
    Animated.timing(panY, { toValue: MAX_TRANSLATE_Y, duration: 300, useNativeDriver: true }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.vy < -0.5 || gestureState.dy < -50) expandSheet();
        else if (gestureState.vy > 0.5 || gestureState.dy > 50) collapseSheet();
        else {
          // Snap back to nearest if movement wasn't strong enough
          if ((panY as any).__getValue() < MAX_TRANSLATE_Y / 2) expandSheet();
          else collapseSheet();
        }
      },
    })
  ).current;

  // Search
  const onSearchSubmit = () => {
    if (!searchText.trim()) return;
    setIsLoading(true);
    webviewRef.current?.postMessage(JSON.stringify({ type: 'SEARCH_KEYWORD', keyword: searchText }));
    setSelectedHospital(null); 
    collapseSheet();
  };

  const onReSearch = () => {
    setIsLoading(true);
    setShowReSearchBtn(false);
    webviewRef.current?.postMessage(JSON.stringify({ type: 'RESEARCH_HERE' }));
  };

  const onGoMyLocation = () => {
    webviewRef.current?.postMessage(JSON.stringify({ type: 'GO_MY_LOCATION' }));
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(granted => {
        console.log('Location permission:', granted);
        setIsPermissionChecked(true); // Proceed regardless of grant to load map (fallback to default Loc)
      });
    } else {
      setIsPermissionChecked(true);
    }
  }, []);

  const handleMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'HOSPITAL_LIST') {
        const hospitalsData = msg.data;
        setHospitals(hospitalsData);
        setIsLoading(false);
        setShowReSearchBtn(false);

        // Fetch Images in background without blocking UI
        const fetchPromises = hospitalsData.map(async (hosp: any) => {
          try {
            const res = await fetch(`https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(hosp.place_name + ' 건물')}&size=2`, {
              headers: { 'Authorization': `KakaoAK ${KAKAO_REST_KEY}` }
            });
            const json = await res.json();
            if (json.documents && json.documents.length > 0) {
              hosp.images = json.documents.map((d: any) => d.image_url);
            }
          } catch { }
          return hosp;
        });

        Promise.all(fetchPromises).then(updatedHospitals => {
          setHospitals([...updatedHospitals]);
        });

      } else if (msg.type === 'MARKER_CLICK') {
        setSelectedHospital(() => {
          const found = hospitals.find((h: any) => h.id === msg.data.id) || msg.data;
          return found;
        });
        expandSheet(); // Expand automatically when clicking a marker
      } else if (msg.type === 'MAP_CLICK') {
        setSelectedHospital(null);
        collapseSheet();
      } else if (msg.type === 'MAP_MOVED') {
        // Prevent showing research btn if we just clicked a marker which moved the map slightly
        setShowReSearchBtn(true);
      }
    } catch {
      console.log('WebView Message Parse Error');
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta name="referrer" content="origin">
        <style>
          html, body { width: 100%; height: 100%; margin: 0; padding: 0; background-color: #f2f2f2; overflow: hidden; }
          #map { width: 100%; height: 100%; }
          .my-loc-marker { 
            width:18px; height:18px; background-color:#3FA2FF; 
            border-radius:50%; border:3px solid #fff; 
            box-shadow:0 0 6px rgba(0,0,0,0.4); 
          }
        </style>
        <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services"></script>
        <script>
          function postMessageToRN(type, data) {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, data: data }));
            }
          }

          window.onload = function() {
            try {
              var container = document.getElementById('map');
              var defaultLat = 37.5665;
              var defaultLng = 126.9780;
              var map = new kakao.maps.Map(container, { center: new kakao.maps.LatLng(defaultLat, defaultLng), level: 4 });

              var ps = new kakao.maps.services.Places(map);
              var activeMarkers = [];
              var myLocOverlay = null;

              function clearMarkers() {
                for (var i = 0; i < activeMarkers.length; i++) {
                  activeMarkers[i].setMap(null);
                }
                activeMarkers = [];
              }

              // Update My Location Dot
              function updateMyLocation(lat, lng) {
                var loc = new kakao.maps.LatLng(lat, lng);
                if (!myLocOverlay) {
                  var content = '<div class="my-loc-marker"></div>';
                  myLocOverlay = new kakao.maps.CustomOverlay({
                    position: loc,
                    content: content
                  });
                  myLocOverlay.setMap(map);
                } else {
                  myLocOverlay.setPosition(loc);
                }
                map.setCenter(loc);
              }

              kakao.maps.event.addListener(map, 'click', function() {
                postMessageToRN('MAP_CLICK', null);
              });

              // Notify pan/movement to show "Search Here" button
              kakao.maps.event.addListener(map, 'dragend', function() {
                postMessageToRN('MAP_MOVED', null);
              });

              function renderPlaces(data, status) {
                 if (status === kakao.maps.services.Status.OK) {
                    clearMarkers();
                    postMessageToRN('HOSPITAL_LIST', data);
                    
                    data.forEach(function(place, i) {
                      var markerPosition = new kakao.maps.LatLng(place.y, place.x);
                      var marker = new kakao.maps.Marker({
                        position: markerPosition,
                        map: map
                      });
                      activeMarkers.push(marker);
                      
                      kakao.maps.event.addListener(marker, 'click', function() {
                        postMessageToRN('MARKER_CLICK', place);
                      });
                    });
                 } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                    clearMarkers();
                    postMessageToRN('HOSPITAL_LIST', []);
                 }
              }

              function searchHospitals(lat, lng) {
                ps.categorySearch('HP8', renderPlaces, {
                  location: new kakao.maps.LatLng(lat, lng),
                  radius: 3000, 
                  sort: kakao.maps.services.SortBy.DISTANCE
                });
              }

              function handleAppMessage(event) {
                try {
                  var msg = JSON.parse(event.data);
                  if (msg.type === 'SEARCH_KEYWORD') {
                    ps.keywordSearch(msg.keyword, function(data, status) {
                      renderPlaces(data, status);
                      if (data.length > 0) {
                        map.setCenter(new kakao.maps.LatLng(data[0].y, data[0].x));
                      }
                    }, {
                      location: map.getCenter(),
                      radius: 3000,
                      sort: kakao.maps.services.SortBy.DISTANCE
                    });
                  } else if (msg.type === 'RESEARCH_HERE') {
                    var center = map.getCenter();
                    searchHospitals(center.getLat(), center.getLng());
                  } else if (msg.type === 'GO_MY_LOCATION') {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(function(position) {
                        updateMyLocation(position.coords.latitude, position.coords.longitude);
                      });
                    }
                  }
                } catch(e) {}
              }
              window.addEventListener("message", handleAppMessage);
              document.addEventListener("message", handleAppMessage);

              // Initial Geolocation after SDK load
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                  var lat = position.coords.latitude;
                  var lng = position.coords.longitude;
                  updateMyLocation(lat, lng);
                  searchHospitals(lat, lng);
                }, function(error) {
                  searchHospitals(defaultLat, defaultLng);
                }, { enableHighAccuracy: true });
              } else {
                searchHospitals(defaultLat, defaultLng);
              }
              
            } catch(e) {
              document.getElementById('map').innerHTML = "<div>Error</div>";
            }
          };
        </script>
      </head>
      <body>
        <div id="map"></div>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Map Render */}
      <View style={styles.mapContainer}>
        {isPermissionChecked ? (
          <WebView
            ref={webviewRef}
            originWhitelist={['*']}
            source={{ html: htmlContent, baseUrl: 'http://localhost' }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            geolocationEnabled={true}
            mixedContentMode="always"
            allowFileAccess={true}
            onMessage={handleMessage}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#3FA2FF" />
            <Text style={styles.loadingText}>지도 환경을 준비 중입니다...</Text>
          </View>
        )}
      </View>

      {/* 2. Top UI: Back, Searh, Notice */}
      <View style={styles.topSection} pointerEvents="box-none">
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconButtonSmall} onPress={() => setHasAlarm(!hasAlarm)}>
              <Image
                source={hasAlarm ? require('../../assets/image/red_bell.png') : require('../../assets/image/bell.png')}
                style={styles.iconImageSmall}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButtonSmall}>
              <Image source={require('../../assets/image/buger.png')} style={styles.iconImageHamburger} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBarWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="상세 검색 (예: 정형외과)"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={onSearchSubmit}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={onSearchSubmit}>
            <Image source={require('../../assets/image/Magnifier_img.png')} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>

        {showReSearchBtn && (
          <TouchableOpacity style={styles.reSearchBtn} onPress={onReSearch}>
            <Text style={styles.reSearchText}>↺ 이 지역 지도로 검색</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center Loading Overlay */}
      {isLoading && isPermissionChecked && (
        <View style={styles.floatingLoader} pointerEvents="none">
          <ActivityIndicator size="large" color="#3FA2FF" />
        </View>
      )}

      {/* 3. My Location GPS Button */}
      <Animated.View style={[styles.myLocBtnWrap, { transform: [{ translateY: panY }] }]}>
        <TouchableOpacity style={styles.myLocBtn} onPress={onGoMyLocation}>
          <Text style={styles.myLocText}>⌖</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* 4. Draggable Bottom Sheet */}
      <Animated.View style={[styles.bottomSheetContainer, { transform: [{ translateY: panY }] }]}>
        <View {...panResponder.panHandlers} style={styles.dragHandleWrap}>
          <View style={styles.dragHandle} />
        </View>

        <ScrollView style={styles.bottomSheetScroll} showsVerticalScrollIndicator={false}>
          {selectedHospital ? (() => {
            const activeHosp = hospitals.find(h => h.id === selectedHospital.id) || selectedHospital;
            return (
              <View style={styles.detailContainer}>
                <Text style={styles.detailTitle}>{activeHosp.place_name}</Text>
                <Text style={styles.detailCategory}>{activeHosp.category_group_name}</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailAddress}>{activeHosp.road_address_name || activeHosp.address_name}</Text>
                  {activeHosp.phone ? <Text style={styles.detailPhone}>{activeHosp.phone}</Text> : null}
                </View>

                <View style={styles.imageGallery}>
                  <Image
                    source={activeHosp.images && activeHosp.images[0] ? { uri: activeHosp.images[0] } : require('../../assets/image/Hospital.png')}
                    style={styles.galleryImg}
                  />
                  <Image
                    source={activeHosp.images && activeHosp.images[1] ? { uri: activeHosp.images[1] } : require('../../assets/image/Hospital.png')}
                    style={styles.galleryImg}
                  />
                </View>

                <Text style={styles.tempDesc}>진료중  20:00까지</Text>
              </View>
            );
          })() : (
            <View style={styles.listContainer}>
              <View style={styles.listHeaderRow}>
                <View style={styles.filterBtn}>
                  <Text style={styles.filterBtnText}>⌖ 주변 결과</Text>
                </View>
                <Text style={styles.filterSub}>거리 순으로 매핑된 결과입니다.</Text>
              </View>

              {hospitals.map((hosp: any, idx: number) => (
                <TouchableOpacity
                  key={hosp.id}
                  style={styles.hospitalCard}
                  activeOpacity={0.9}
                  onPress={() => setSelectedHospital(hosp)}
                >
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{idx + 1}</Text>
                  </View>
                  <Image
                    source={hosp.images && hosp.images[0] ? { uri: hosp.images[0] } : require('../../assets/image/Hospital.png')}
                    style={styles.hospitalImage}
                  />
                  <View style={styles.hospitalInfo}>
                    <Text style={styles.hospitalName}>{hosp.place_name}</Text>
                    <Text style={styles.hospitalAddr} numberOfLines={1}>{hosp.road_address_name || hosp.address_name}</Text>
                    <Text style={styles.hospitalMeta}>{hosp.distance ? `${hosp.distance}m 떨어짐` : '거리정보 없음'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  mapContainer: { ...StyleSheet.absoluteFillObject },
  webview: { flex: 1, backgroundColor: 'transparent' },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#666', fontSize: 13 },
  floatingLoader: {
    position: 'absolute', top: '45%', left: '46%', 
    backgroundColor: 'rgba(255,255,255,0.8)', padding: 12, borderRadius: 30,
    shadowColor: '#000', shadowOpacity: 0.1, elevation: 4
  },

  topSection: { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 15, zIndex: 10 },
  topBar: { paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  iconButton: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 36, fontWeight: '500', color: '#000', marginBottom: 5 },
  rightIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButtonSmall: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center', marginLeft: 5 },
  iconImageSmall: { width: 28, height: 28 },
  iconImageHamburger: { width: 28, height: 28 },

  searchBarWrap: {
    marginHorizontal: 18, backgroundColor: '#fff', borderRadius: 25,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 52,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 4,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#333' },
  searchIcon: { width: 24, height: 24, resizeMode: 'contain', marginLeft: 10 },

  reSearchBtn: {
    alignSelf: 'center', marginTop: 15,
    backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 18,
    borderRadius: 22, borderWidth: 1, borderColor: '#3FA2FF',
    shadowColor: '#000', shadowOpacity: 0.1, elevation: 3,
  },
  reSearchText: { color: '#3FA2FF', fontWeight: '800', fontSize: 13 },

  myLocBtnWrap: {
    position: 'absolute', bottom: BOTTOM_SHEET_MAX_HEIGHT + 15, right: 18, zIndex: 15,
  },
  myLocBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  myLocText: { fontSize: 26, color: '#3FA2FF', fontWeight: 'bold' },

  bottomSheetContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: BOTTOM_SHEET_MAX_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 0, height: -5 }, shadowRadius: 15, elevation: 15,
  },
  dragHandleWrap: { width: '100%', alignItems: 'center', paddingVertical: 14, backgroundColor: 'transparent' },
  dragHandle: { width: 44, height: 5, borderRadius: 3, backgroundColor: '#CCC' },
  bottomSheetScroll: { paddingBottom: 24 },

  listContainer: { paddingHorizontal: 18 },
  listHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: '#ddd' },
  filterBtnText: { fontSize: 11, fontWeight: 'bold', color: '#444' },
  filterSub: { fontSize: 12, color: '#777', fontWeight: '500' },

  hospitalCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1, borderColor: '#f0f0f0', marginBottom: 12, alignItems: 'center', padding: 10,
    shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 1,
  },
  rankBadge: {
    position: 'absolute', top: 10, left: 10, width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#3FA2FF', justifyContent: 'center', alignItems: 'center', zIndex: 2,
  },
  rankText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  hospitalImage: { width: 90, height: 80, borderRadius: 10, resizeMode: 'cover' },
  hospitalInfo: { flex: 1, paddingLeft: 12, justifyContent: 'center' },
  hospitalName: { fontSize: 15, fontWeight: '800', color: '#222', marginBottom: 4 },
  hospitalAddr: { fontSize: 12, color: '#666', marginBottom: 6 },
  hospitalMeta: { fontSize: 13, color: '#3FA2FF', fontWeight: '800' },

  detailContainer: { paddingHorizontal: 22, paddingBottom: 10 },
  detailTitle: { fontSize: 22, fontWeight: '900', color: '#111' },
  detailCategory: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 12, fontWeight: '600' },
  detailRow: { marginBottom: 12 },
  detailAddress: { fontSize: 14, color: '#444', lineHeight: 20 },
  detailPhone: { fontSize: 14, color: '#3FA2FF', marginTop: 4, fontWeight: '600' },
  imageGallery: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 14 },
  galleryImg: { width: '48%', height: 120, borderRadius: 14, resizeMode: 'cover' },
  tempDesc: { fontSize: 13, fontWeight: 'bold', color: '#2E7D32', marginVertical: 4 }
});