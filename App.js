import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Text, View, ScrollView, ActivityIndicator } from 'react-native';
const { width:SCREEN_WIDTH } = Dimensions.get("window")

const API_KEY = '55a96e2f32cde80765b1025e9ca3db81';

export default function App() {
  const [city, setCity] = useState("Loading");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5})
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false})
    console.log({latitude, longitude})
    setCity(location[0].city)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);   
    const json = await response.json();
    setDays(
      json.list.filter((weather) => {
      if (weather.dt_txt.includes("00:00:00")) {
      return weather;
      }
      })
    );
    console.log(days)
  };
  useEffect(() => {
    getWeather();
  },[]);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        
        {days.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator color='green' size='large' />
            </View>
          ) :  (
            days.map((day,index) => 
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>
              {parseFloat(day.main.temp).toFixed(1)}
              </Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}
              </Text>
            </View>
            )
          )
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "violet",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {
    backgroundColor : 'pink'
  },
  day: {
    width : SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 178,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
});