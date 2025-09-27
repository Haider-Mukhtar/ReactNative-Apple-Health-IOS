# React Native Apple HealthKit Integration with Expo 🚀

![Banner](https://github.com/user-attachments/assets/e597e580-27e0-4b91-8a1f-72d6b59f4ee6)

**A robust, TypeScript-based React Native Expo app demonstrating seamless integration with Apple HealthKit using `react-native-health`.**

This repository provides a complete guide and codebase for integrating **Apple HealthKit** into a **React Native Expo** app. Fetch health data like steps, calories burned, heart rate, and sleep with ease, while handling permissions, errors, and best practices. Built with TypeScript for type safety, this project is perfect for developers building fitness or wellness apps in 2025! 🎉

For a detailed step-by-step tutorial, check out our Medium post.
**[Seamless Integration of Apple Health into Your React Native Expo App 🚀](https://medium.com/@haidermukhtar/seamless-integration-of-apple-health-into-your-react-native-expo-app-7e9ecade0ae8)**

> **Note**: HealthKit is iOS-only. For Android, consider `react-native-health-connect`. Always test on a physical iOS device and comply with GDPR/HIPAA for user privacy.

## 🎯 Features
- Fetch **steps**, **calories burned**, **heart rate**, and **sleep** data from Apple Health.
- Custom React hook for streamlined data fetching and permission handling.
- Comprehensive error handling for permission denials and edge cases.
- Expo dev client for native module support.
- TypeScript for robust type safety.
- Clean, reusable code structure for scalability.

## 📸 Demo
![Demo](https://github.com/user-attachments/assets/ef9f6dc1-0600-44fc-855d-9b54c5136cc4)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/react-native-healthkit-expo.git
cd react-native-healthkit-expo
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Run the App
```bash
npx expo run:ios
```

## 📂 Project Structure
```
├── app/
│   ├── _layout.tsx           # Main app layout
│   ├── index.tsx             # Main app screen
│── assets/
│── hooks/
│   │── useHealthData.ts      # Custom hook for Apple Health data
├── app.json                  # Expo configuration
├── ios/                      # Native iOS files
├── README.md                 # You're here!
```

## 📚 Use Cases
- **Fitness Tracker:** Auto-log steps and calories for gamified goals.
- **Sleep Analyzer:** Track sleep duration for wellness insights.
- **Health Monitor:** Alert on irregular heart rates.

## 🤝 Contributing
Contributions are welcome! 🙌 Fork the repo, create a branch, and submit a pull request. Check issues for tasks or report bugs.

## 📜 License
MIT License. See [LICENSE](https://github.com/Haider-Mukhtar/ReactNative-Apple-Health-IOS/blob/main/LICENSE) for details.

Happy coding! Build something amazing with Apple Health in 2025! 💻
