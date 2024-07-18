const { Prisma, PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

// const mongoose = require("mongoose");

// const mongoURI = "mongodb://localhost:27017/traindata";

// mongoose
//   .connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// In-memory train data (replace with database in real application)
let trains = [
  {
    train_name: "Deccan Queen",
    train_number: "12123",
    date_of_availability: "daily",
    route_points: [
      {
        station: "Mumbai CST",
        departure_time: "07:00",
        arrival_time: "07:05",
        available_seats: 80,
      },
      {
        station: "Lonavla",
        departure_time: "08:30",
        arrival_time: "08:35",
        available_seats: 75,
      },
      {
        station: "Pune",
        departure_time: "09:30",
        arrival_time: "09:35",
        available_seats: 85,
      },
      {
        station: "Daund",
        departure_time: "10:30",
        arrival_time: "10:35",
        available_seats: 65,
      },
      {
        station: "Ahmednagar",
        departure_time: "11:30",
        arrival_time: "11:35",
        available_seats: 70,
      },
      {
        station: "Belapur",
        departure_time: "12:30",
        arrival_time: "12:35",
        available_seats: 60,
      },
      {
        station: "Kopargaon",
        departure_time: "13:30",
        arrival_time: "13:35",
        available_seats: 55,
      },
      {
        station: "Manmad",
        departure_time: "14:30",
        arrival_time: "14:35",
        available_seats: 50,
      },
      {
        station: "Nasik Road",
        departure_time: "15:30",
        arrival_time: "15:35",
        available_seats: 45,
      },
      {
        station: "Igatpuri",
        departure_time: "16:30",
        arrival_time: "16:35",
        available_seats: 40,
      },
      {
        station: "Kalyan",
        departure_time: "17:30",
        arrival_time: "17:35",
        available_seats: 65,
      },
      {
        station: "Thane",
        departure_time: "18:30",
        arrival_time: "18:35",
        available_seats: 75,
      },
      {
        station: "Dadar",
        departure_time: "19:30",
        arrival_time: "19:35",
        available_seats: 80,
      },
      {
        station: "Mumbai CST",
        departure_time: "20:30",
        arrival_time: "20:35",
        available_seats: 85,
      },
    ],
    fare: {
      SL: 500,
      "3AC": 1200,
      "2AC": 1600,
      "1AC": 2500,
    },
  },
  {
    train_name: "Shatabdi Express",
    train_number: "12010",
    date_of_availability: "Monday, Wednesday, Friday",
    route_points: [
      {
        station: "New Delhi",
        departure_time: "06:00",
        arrival_time: "06:05",
        available_seats: 90,
      },
      {
        station: "Ghaziabad",
        departure_time: "06:30",
        arrival_time: "06:35",
        available_seats: 85,
      },
      {
        station: "Meerut City",
        departure_time: "07:30",
        arrival_time: "07:35",
        available_seats: 80,
      },
      {
        station: "Muzaffarnagar",
        departure_time: "08:30",
        arrival_time: "08:35",
        available_seats: 75,
      },
      {
        station: "Saharanpur",
        departure_time: "09:30",
        arrival_time: "09:35",
        available_seats: 70,
      },
      {
        station: "Yamunanagar Jagadhri",
        departure_time: "10:30",
        arrival_time: "10:35",
        available_seats: 65,
      },
      {
        station: "Ambala Cantt",
        departure_time: "11:30",
        arrival_time: "11:35",
        available_seats: 60,
      },
      {
        station: "Ludhiana",
        departure_time: "12:30",
        arrival_time: "12:35",
        available_seats: 55,
      },
      {
        station: "Jalandhar Cantt",
        departure_time: "13:30",
        arrival_time: "13:35",
        available_seats: 50,
      },
      {
        station: "Ludhiana",
        departure_time: "14:30",
        arrival_time: "14:35",
        available_seats: 45,
      },
      {
        station: "Ambala Cantt",
        departure_time: "15:30",
        arrival_time: "15:35",
        available_seats: 40,
      },
      {
        station: "Saharanpur",
        departure_time: "16:30",
        arrival_time: "16:35",
        available_seats: 65,
      },
      {
        station: "Muzaffarnagar",
        departure_time: "17:30",
        arrival_time: "17:35",
        available_seats: 70,
      },
      {
        station: "Meerut City",
        departure_time: "18:30",
        arrival_time: "18:35",
        available_seats: 75,
      },
      {
        station: "Ghaziabad",
        departure_time: "19:30",
        arrival_time: "19:35",
        available_seats: 80,
      },
      {
        station: "New Delhi",
        departure_time: "20:30",
        arrival_time: "20:35",
        available_seats: 85,
      },
    ],
    fare: {
      SL: 600,
      "3AC": 1400,
      "2AC": 1800,
      "1AC": 2800,
    },
  },
  {
    train_name: "Rajdhani Express",
    train_number: "12951",
    date_of_availability: "Daily",
    route_points: [
      {
        station: "New Delhi",
        departure_time: "16:00",
        arrival_time: "16:05",
        available_seats: 85,
      },
      {
        station: "Kanpur Central",
        departure_time: "20:30",
        arrival_time: "20:35",
        available_seats: 75,
      },
      {
        station: "Allahabad Junction",
        departure_time: "23:00",
        arrival_time: "23:05",
        available_seats: 70,
      },
      {
        station: "Patna Junction",
        departure_time: "03:30",
        arrival_time: "03:35",
        available_seats: 65,
      },
      {
        station: "Mughalsarai Junction",
        departure_time: "06:00",
        arrival_time: "06:05",
        available_seats: 60,
      },
      {
        station: "Gaya Junction",
        departure_time: "08:30",
        arrival_time: "08:35",
        available_seats: 55,
      },
      {
        station: "Dhanbad Junction",
        departure_time: "11:00",
        arrival_time: "11:05",
        available_seats: 50,
      },
      {
        station: "Howrah Junction",
        departure_time: "15:00",
        arrival_time: "15:05",
        available_seats: 45,
      },
    ],
    fare: {
      SL: 700,
      "3AC": 1500,
      "2AC": 2000,
      "1AC": 3000,
    },
  },
  {
    train_name: "Duronto Express",
    train_number: "12213",
    date_of_availability: "Monday, Thursday, Saturday",
    route_points: [
      {
        station: "Mumbai Central",
        departure_time: "23:15",
        arrival_time: "23:20",
        available_seats: 80,
      },
      {
        station: "Vadodara Junction",
        departure_time: "03:00",
        arrival_time: "03:05",
        available_seats: 75,
      },
      {
        station: "Surat",
        departure_time: "05:00",
        arrival_time: "05:05",
        available_seats: 70,
      },
      {
        station: "Bharuch Junction",
        departure_time: "06:30",
        arrival_time: "06:35",
        available_seats: 65,
      },
      {
        station: "Vapi",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 60,
      },
      {
        station: "Borivali",
        departure_time: "09:30",
        arrival_time: "09:35",
        available_seats: 55,
      },
      {
        station: "Mumbai Central",
        departure_time: "10:30",
        arrival_time: "10:35",
        available_seats: 50,
      },
    ],
    fare: {
      SL: 550,
      "3AC": 1300,
      "2AC": 1700,
      "1AC": 2600,
    },
  },
  {
    train_name: "Gatimaan Express",
    train_number: "12049",
    date_of_availability: "Daily",
    route_points: [
      {
        station: "New Delhi",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 90,
      },
      {
        station: "Agra Cantt",
        departure_time: "09:50",
        arrival_time: "09:55",
        available_seats: 85,
      },
      {
        station: "Gwalior Junction",
        departure_time: "11:25",
        arrival_time: "11:30",
        available_seats: 80,
      },
      {
        station: "Jhansi Junction",
        departure_time: "12:35",
        arrival_time: "12:40",
        available_seats: 75,
      },
      {
        station: "Bhopal Junction",
        departure_time: "15:15",
        arrival_time: "15:20",
        available_seats: 70,
      },
      {
        station: "Jhansi Junction",
        departure_time: "17:10",
        arrival_time: "17:15",
        available_seats: 65,
      },
      {
        station: "Gwalior Junction",
        departure_time: "18:25",
        arrival_time: "18:30",
        available_seats: 60,
      },
      {
        station: "Agra Cantt",
        departure_time: "20:10",
        arrival_time: "20:15",
        available_seats: 55,
      },
      {
        station: "New Delhi",
        departure_time: "21:50",
        arrival_time: "21:55",
        available_seats: 50,
      },
    ],
    fare: {
      SL: 700,
      "3AC": 1500,
      "2AC": 2000,
      "1AC": 3000,
    },
  },
  {
    train_name: "Tejas Express",
    train_number: "82501",
    date_of_availability: "Tuesday, Thursday, Saturday",
    route_points: [
      {
        station: "Mumbai CSMT",
        departure_time: "05:00",
        arrival_time: "05:05",
        available_seats: 80,
      },
      {
        station: "Panvel Junction",
        departure_time: "05:50",
        arrival_time: "05:55",
        available_seats: 75,
      },
      {
        station: "Ratnagiri",
        departure_time: "09:00",
        arrival_time: "09:05",
        available_seats: 70,
      },
      {
        station: "Madgaon Junction",
        departure_time: "12:10",
        arrival_time: "12:15",
        available_seats: 65,
      },
      {
        station: "Karwar",
        departure_time: "14:45",
        arrival_time: "14:50",
        available_seats: 60,
      },
      {
        station: "Mangalore Junction",
        departure_time: "17:45",
        arrival_time: "17:50",
        available_seats: 55,
      },
      {
        station: "Kannur",
        departure_time: "19:30",
        arrival_time: "19:35",
        available_seats: 50,
      },
      {
        station: "Kozhikode",
        departure_time: "21:00",
        arrival_time: "21:05",
        available_seats: 45,
      },
      {
        station: "Ernakulam Junction",
        departure_time: "23:45",
        arrival_time: "23:50",
        available_seats: 40,
      },
      {
        station: "Thiruvananthapuram Central",
        departure_time: "03:00",
        arrival_time: "03:05",
        available_seats: 35,
      },
      {
        station: "Ernakulam Junction",
        departure_time: "06:00",
        arrival_time: "06:05",
        available_seats: 30,
      },
      {
        station: "Kozhikode",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 25,
      },
      {
        station: "Kannur",
        departure_time: "09:30",
        arrival_time: "09:35",
        available_seats: 20,
      },
      {
        station: "Mangalore Junction",
        departure_time: "11:15",
        arrival_time: "11:20",
        available_seats: 15,
      },
      {
        station: "Karwar",
        departure_time: "14:15",
        arrival_time: "14:20",
        available_seats: 10,
      },
      {
        station: "Madgaon Junction",
        departure_time: "16:50",
        arrival_time: "16:55",
        available_seats: 5,
      },
      {
        station: "Ratnagiri",
        departure_time: "20:05",
        arrival_time: "20:10",
        available_seats: 80,
      },
      {
        station: "Panvel Junction",
        departure_time: "23:20",
        arrival_time: "23:25",
        available_seats: 85,
      },
      {
        station: "Mumbai CSMT",
        departure_time: "00:10",
        arrival_time: "00:15",
        available_seats: 90,
      },
    ],
    fare: {
      SL: 650,
      "3AC": 1400,
      "2AC": 1800,
      "1AC": 2800,
    },
  },
  {
    train_name: "Garib Rath Express",
    train_number: "12203",
    date_of_availability: "Tuesday, Thursday, Saturday",
    route_points: [
      {
        station: "Saharsa Junction",
        departure_time: "20:00",
        arrival_time: "20:05",
        available_seats: 80,
      },
      {
        station: "Bhagalpur",
        departure_time: "21:30",
        arrival_time: "21:35",
        available_seats: 75,
      },
      {
        station: "Jamalpur Junction",
        departure_time: "22:30",
        arrival_time: "22:35",
        available_seats: 70,
      },
      {
        station: "Kiul Junction",
        departure_time: "23:30",
        arrival_time: "23:35",
        available_seats: 65,
      },
      {
        station: "Patna Junction",
        departure_time: "01:30",
        arrival_time: "01:35",
        available_seats: 60,
      },
      {
        station: "Ara Junction",
        departure_time: "03:00",
        arrival_time: "03:05",
        available_seats: 55,
      },
      {
        station: "Buxar",
        departure_time: "04:30",
        arrival_time: "04:35",
        available_seats: 50,
      },
      {
        station: "Mughalsarai Junction",
        departure_time: "06:00",
        arrival_time: "06:05",
        available_seats: 45,
      },
      {
        station: "Varanasi Junction",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 40,
      },
      {
        station: "Allahabad Junction",
        departure_time: "10:30",
        arrival_time: "10:35",
        available_seats: 35,
      },
      {
        station: "Lucknow Junction",
        departure_time: "14:00",
        arrival_time: "14:05",
        available_seats: 30,
      },
      {
        station: "Barabanki Junction",
        departure_time: "15:30",
        arrival_time: "15:35",
        available_seats: 25,
      },
      {
        station: "Gonda Junction",
        departure_time: "17:30",
        arrival_time: "17:35",
        available_seats: 20,
      },
      {
        station: "Basti",
        departure_time: "18:45",
        arrival_time: "18:50",
        available_seats: 15,
      },
      {
        station: "Gorakhpur Junction",
        departure_time: "20:30",
        arrival_time: "20:35",
        available_seats: 10,
      },
      {
        station: "Deoria Sadar",
        departure_time: "21:30",
        arrival_time: "21:35",
        available_seats: 5,
      },
      {
        station: "Siwan Junction",
        departure_time: "23:00",
        arrival_time: "23:05",
        available_seats: 80,
      },
      {
        station: "Chhapra Junction",
        departure_time: "01:00",
        arrival_time: "01:05",
        available_seats: 85,
      },
      {
        station: "Hajipur Junction",
        departure_time: "03:00",
        arrival_time: "03:05",
        available_seats: 90,
      },
      {
        station: "Patna Junction",
        departure_time: "04:30",
        arrival_time: "04:35",
        available_seats: 95,
      },
      {
        station: "Jhajha",
        departure_time: "06:30",
        arrival_time: "06:35",
        available_seats: 100,
      },
      {
        station: "Jasidih Junction",
        departure_time: "08:15",
        arrival_time: "08:20",
        available_seats: 105,
      },
      {
        station: "Madhupur Junction",
        departure_time: "09:00",
        arrival_time: "09:05",
        available_seats: 110,
      },
      {
        station: "Asansol Junction",
        departure_time: "10:45",
        arrival_time: "10:50",
        available_seats: 115,
      },
      {
        station: "Durgapur",
        departure_time: "11:30",
        arrival_time: "11:35",
        available_seats: 120,
      },
      {
        station: "Barddhaman Junction",
        departure_time: "12:45",
        arrival_time: "12:50",
        available_seats: 125,
      },
      {
        station: "Howrah Junction",
        departure_time: "14:30",
        arrival_time: "14:35",
        available_seats: 130,
      },
    ],
    fare: {
      SL: 600,
      "3AC": 1400,
      "2AC": 1800,
      "1AC": 2700,
    },
  },
  {
    train_name: "Humsafar Express",
    train_number: "22913",
    date_of_availability: "Daily",
    route_points: [
      {
        station: "Pune",
        departure_time: "15:00",
        arrival_time: "15:05",
        available_seats: 90,
      },
      {
        station: "Solapur Junction",
        departure_time: "18:30",
        arrival_time: "18:35",
        available_seats: 85,
      },
      {
        station: "Kalaburagi Junction",
        departure_time: "21:00",
        arrival_time: "21:05",
        available_seats: 80,
      },
      {
        station: "Secunderabad Junction",
        departure_time: "00:30",
        arrival_time: "00:35",
        available_seats: 75,
      },
      {
        station: "Vijayawada Junction",
        departure_time: "04:00",
        arrival_time: "04:05",
        available_seats: 70,
      },
      {
        station: "Visakhapatnam Junction",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 65,
      },
    ],
    fare: {
      SL: 600,
      "3AC": 1400,
      "2AC": 1800,
      "1AC": 2700,
    },
  },
  {
    train_name: "Tejas Express",
    train_number: "22119",
    date_of_availability: "Monday, Thursday, Saturday",
    route_points: [
      {
        station: "Mumbai CST",
        departure_time: "17:00",
        arrival_time: "17:05",
        available_seats: 90,
      },
      {
        station: "Pune",
        departure_time: "20:00",
        arrival_time: "20:05",
        available_seats: 85,
      },
      {
        station: "Belagavi",
        departure_time: "23:00",
        arrival_time: "23:05",
        available_seats: 80,
      },
      {
        station: "Hubballi Junction",
        departure_time: "03:00",
        arrival_time: "03:05",
        available_seats: 75,
      },
      {
        station: "Dharwad",
        departure_time: "04:30",
        arrival_time: "04:35",
        available_seats: 70,
      },
      {
        station: "Bengaluru City",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 65,
      },
    ],
    fare: {
      SL: 600,
      "3AC": 1400,
      "2AC": 1800,
      "1AC": 2700,
    },
  },
  {
    train_name: "Maharaja Express",
    train_number: "9001",
    date_of_availability: "Seasonal",
    route_points: [
      {
        station: "Delhi Safdarjung",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 80,
      },
      {
        station: "Agra Cantt",
        departure_time: "12:00",
        arrival_time: "12:05",
        available_seats: 75,
      },
      {
        station: "Jaipur Junction",
        departure_time: "16:00",
        arrival_time: "16:05",
        available_seats: 70,
      },
      {
        station: "Ranthambore",
        departure_time: "19:00",
        arrival_time: "19:05",
        available_seats: 65,
      },
      {
        station: "Bikaner",
        departure_time: "22:00",
        arrival_time: "22:05",
        available_seats: 60,
      },
      {
        station: "Jodhpur Junction",
        departure_time: "01:00",
        arrival_time: "01:05",
        available_seats: 55,
      },
      {
        station: "Udaipur City",
        departure_time: "04:00",
        arrival_time: "04:05",
        available_seats: 50,
      },
      {
        station: "Balasinor",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 45,
      },
    ],
    fare: {
      SL: 600,
      "3AC": 1400,
      "2AC": 1800,
      "1AC": 2700,
    },
  },
  {
    train_name: "Vande Bharat Express",
    train_number: "22439",
    date_of_availability: "Daily",
    route_points: [
      {
        station: "New Delhi",
        departure_time: "06:00",
        arrival_time: "06:05",
        available_seats: 90,
      },
      {
        station: "Kanpur Central",
        departure_time: "08:30",
        arrival_time: "08:35",
        available_seats: 85,
      },
      {
        station: "Prayagraj Junction",
        departure_time: "11:00",
        arrival_time: "11:05",
        available_seats: 80,
      },
      {
        station: "Varanasi Junction",
        departure_time: "13:30",
        arrival_time: "13:35",
        available_seats: 75,
      },
      {
        station: "Patna Junction",
        departure_time: "16:00",
        arrival_time: "16:05",
        available_seats: 70,
      },
      {
        station: "Mughalsarai Junction",
        departure_time: "18:30",
        arrival_time: "18:35",
        available_seats: 65,
      },
      {
        station: "Allahabad Junction",
        departure_time: "21:00",
        arrival_time: "21:05",
        available_seats: 60,
      },
      {
        station: "New Delhi",
        departure_time: "23:30",
        arrival_time: "23:35",
        available_seats: 55,
      },
    ],
    fare: {
      SL: 600,
      "3AC": 1400,
      "2AC": 1800,
      "1AC": 2700,
    },
  },
  {
    train_name: "Shatabdi Express",
    train_number: "12011",
    date_of_availability: "Tuesday, Thursday, Saturday",
    route_points: [
      {
        station: "Chennai Central",
        departure_time: "06:00",
        arrival_time: "06:05",
        available_seats: 85,
      },
      {
        station: "Katpadi Junction",
        departure_time: "07:00",
        arrival_time: "07:05",
        available_seats: 80,
      },
      {
        station: "Salem Junction",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 75,
      },
      {
        station: "Bangalore City",
        departure_time: "10:00",
        arrival_time: "10:05",
        available_seats: 70,
      },
      {
        station: "Mysore Junction",
        departure_time: "12:00",
        arrival_time: "12:05",
        available_seats: 65,
      },
      {
        station: "Hubli Junction",
        departure_time: "14:00",
        arrival_time: "14:05",
        available_seats: 60,
      },
      {
        station: "Belgaum",
        departure_time: "16:00",
        arrival_time: "16:05",
        available_seats: 55,
      },
      {
        station: "Miraj Junction",
        departure_time: "18:00",
        arrival_time: "18:05",
        available_seats: 50,
      },
      {
        station: "Pune",
        departure_time: "21:00",
        arrival_time: "21:05",
        available_seats: 45,
      },
      {
        station: "Lonavla",
        departure_time: "22:00",
        arrival_time: "22:05",
        available_seats: 40,
      },
      {
        station: "Mumbai CST",
        departure_time: "23:30",
        arrival_time: "23:35",
        available_seats: 35,
      },
    ],
    fare: {
      SL: 600,
      "3AC": 1400,
      "2AC": 1800,
      "1AC": 2700,
    },
  },
  {
    train_name: "Himalayan Queen",
    train_number: "52455",
    date_of_availability: "Daily",
    route_points: [
      {
        station: "Kalka",
        departure_time: "12:10",
        arrival_time: "12:15",
        available_seats: 80,
      },
      {
        station: "Dharampur Himachal",
        departure_time: "13:00",
        arrival_time: "13:05",
        available_seats: 75,
      },
      {
        station: "Kandaghat",
        departure_time: "13:30",
        arrival_time: "13:35",
        available_seats: 70,
      },
      {
        station: "Solan",
        departure_time: "14:00",
        arrival_time: "14:05",
        available_seats: 65,
      },
      {
        station: "Barog",
        departure_time: "14:30",
        arrival_time: "14:35",
        available_seats: 60,
      },
      {
        station: "Salogra",
        departure_time: "15:00",
        arrival_time: "15:05",
        available_seats: 55,
      },
      {
        station: "Summer Hill",
        departure_time: "15:30",
        arrival_time: "15:35",
        available_seats: 50,
      },
      {
        station: "Shimla",
        departure_time: "16:00",
        arrival_time: "16:05",
        available_seats: 45,
      },
    ],
    fare: {
      SL: 600,
      "3AC": 1400,
      "2AC": 1800,
      "1AC": 2700,
    },
  },
  {
    train_name: "Mahaparinirvan Express",
    train_number: "22446",
    date_of_availability: "Weekly (Wednesday)",
    route_points: [
      {
        station: "New Delhi",
        departure_time: "07:00",
        arrival_time: "07:05",
        available_seats: 80,
      },
      {
        station: "Gaya Junction",
        departure_time: "12:00",
        arrival_time: "12:05",
        available_seats: 75,
      },
      {
        station: "Nagpur",
        departure_time: "23:00",
        arrival_time: "23:05",
        available_seats: 70,
      },
      {
        station: "Mumbai CST",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 65,
      },
    ],
    fare: {
      SL: 600,
      "3AC": 1400,
      "2AC": 1800,
      "1AC": 2700,
    },
  },
  {
    train_name: "Palace on Wheels",
    train_number: "9002",
    date_of_availability: "Seasonal",
    route_points: [
      {
        station: "Delhi Safdarjung",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 90,
      },
      {
        station: "Jaipur Junction",
        departure_time: "12:00",
        arrival_time: "12:05",
        available_seats: 85,
      },
      {
        station: "Jaisalmer",
        departure_time: "16:00",
        arrival_time: "16:05",
        available_seats: 80,
      },
      {
        station: "Jodhpur Junction",
        departure_time: "20:00",
        arrival_time: "20:05",
        available_seats: 75,
      },
      {
        station: "Sawai Madhopur",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 70,
      },
      {
        station: "Chittorgarh",
        departure_time: "12:00",
        arrival_time: "12:05",
        available_seats: 65,
      },
      {
        station: "Udaipur City",
        departure_time: "16:00",
        arrival_time: "16:05",
        available_seats: 60,
      },
      {
        station: "Bharatpur",
        departure_time: "20:00",
        arrival_time: "20:05",
        available_seats: 55,
      },
      {
        station: "Delhi Safdarjung",
        departure_time: "06:00",
        arrival_time: "06:05",
        available_seats: 50,
      },
    ],
    fare: {
      SL: 600,
      "3AC": 1400,
      "2AC": 1800,
      "1AC": 2700,
    },
  },
  {
    train_name: "Kashi Mahakal Express",
    train_number: "82401",
    date_of_availability: "Weekly (Friday)",
    route_points: [
      {
        station: "Varanasi Junction",
        departure_time: "22:00",
        arrival_time: "22:05",
        available_seats: 90,
      },
      {
        station: "Ujjain Junction",
        departure_time: "08:00",
        arrival_time: "08:05",
        available_seats: 85,
      },
      {
        station: "Indore Junction",
        departure_time: "12:00",
        arrival_time: "12:05",
        available_seats: 80,
      },
      {
        station: "Prayagraj Junction",
        departure_time: "16:00",
        arrival_time: "16:05",
        available_seats: 75,
      },
      {
        station: "Lucknow Charbagh",
        departure_time: "20:00",
        arrival_time: "20:05",
        available_seats: 70,
      },
      {
        station: "Ayodhya Junction",
        departure_time: "00:00",
        arrival_time: "00:05",
        available_seats: 65,
      },
      {
        station: "Varanasi Junction",
        departure_time: "04:00",
        arrival_time: "04:05",
        available_seats: 60,
      },
    ],
    fare: {
      SL: 600,
      "3AC": 1400,
      "2AC": 1800,
      "1AC": 2700,
    },
  },
];

let nextBookingId = 0;
let userBookings = [];

const generateSequentialBookingId = () => {
  const id = nextBookingId;
  nextBookingId = (nextBookingId + 1) % 101; // Ensure IDs wrap around from 0 to 100
  return id.toString(); // Convert to string to match UUID format for consistency
};

const verifyTokenFromCookie = (req, res, next) => {
  const token = req.cookies.token; // Retrieve token from cookie
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    next();
  });
};

// Get all trains route (accessible to all users)
router.get("/", (req, res) => {
  res.json(trains);
});

router.post("/add", verifyTokenFromCookie, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { trainName, trainNumber, dateOfAvailability, routePoints, fare } =
    req.body;

  try {
    // Create the new train with related route points and fare
    const newTrain = await prisma.train.create({
      data: {
        trainName,
        trainNumber,
        dateOfAvailability,
        routePoints: {
          create: routePoints,
        },
        fare: {
          create: fare,
        },
      },
      include: {
        routePoints: true,
        fare: true,
      },
    });

    res.json({ message: "Train added successfully", train: newTrain });
  } catch (error) {
    console.error("Error adding train:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Confirm ticket and decrease available seats
// Confirm ticket and decrease available seats
router.post("/confirm-ticket", verifyTokenFromCookie, (req, res) => {
  const { train_number, passengers } = req.body;

  // Find the train by train_number
  const trainIndex = trains.findIndex(
    (train) => train.train_number === train_number
  );
  if (trainIndex === -1) {
    return res.status(404).json({ message: "Train not found" });
  }

  const selectedTrain = trains[trainIndex];

  // Calculate total number of seats to be booked
  const totalSeatsBooked = passengers.length;

  // Check if there are enough available seats
  if (selectedTrain.route_points[0].available_seats < totalSeatsBooked) {
    return res.status(400).json({ message: "Not enough available seats" });
  }

  // Update available seats
  selectedTrain.route_points[0].available_seats -= totalSeatsBooked;

  // Update the trains array
  trains[trainIndex] = selectedTrain;

  // Generate a new sequential bookingId
  const bookingId = generateSequentialBookingId();

  // Simulate storing the booking information
  userBookings.push({
    bookingId,
    name: passengers[0].name, // Assuming using the first passenger's details
    age: passengers[0].age,
    gender: passengers[0].gender,
    train_name: selectedTrain.train_name,
    train_number: selectedTrain.train_number,
  });

  res.json({ message: "Ticket booked successfully", bookingId });
});

router.get("/bookings", verifyTokenFromCookie, (req, res) => {
  res.json(userBookings);
});

router.delete("/bookings/:bookingId", verifyTokenFromCookie, (req, res) => {
  const { bookingId } = req.params;

  // Find the booking by ID
  const index = userBookings.findIndex(
    (booking) => booking.bookingId === bookingId
  );
  if (index === -1) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Remove the booking from userBookings array
  userBookings.splice(index, 1);

  res.json({ message: "Booking deleted successfully" });
});

module.exports = router;
