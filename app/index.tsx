import useHealthData from "@/hooks/useHealthData";
import React from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Index() {
  const date = new Date();
  const {
    steps,
    calories,
    heartRate,
    sleep,
    error,
    success,
    hasPermissions,
    dataTimestamp,
    onPress,
    refetch,
  } = useHealthData(date);

  console.log(steps, calories, heartRate, sleep, dataTimestamp);
  console.log("Success: ", success);
  console.log("Error: ", error);
  console.log("Permission: ", hasPermissions);

  // Get latest heart rate
  const getLatestHeartRate = (heartRate: any[]) => {
    if (!heartRate.length) return "--";
    const sorted = [...heartRate].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
    return sorted[0].value;
  };

  // Calculate total sleep duration (in hours)
  const getTotalSleep = (sleepSamples: any[]) => {
    if (!sleepSamples.length) return "--";

    let totalMs = 0;
    sleepSamples.forEach((sample) => {
      if (sample.value !== "AWAKE") {
        const start = new Date(sample.startDate).getTime();
        const end = new Date(sample.endDate).getTime();
        totalMs += end - start;
      }
    });

    const hours = totalMs / (1000 * 60 * 60);
    return hours.toFixed(1); // e.g. "7.5"
  };

  if (error) {
    Alert.alert("Cannot fetch health data", "Please try again!", [
      {
        text: "Try Again",
        onPress: () => {
          refetch();
        },
      },
    ]);
  }

  if (success) {
    if (
      steps === 0 &&
      calories === 0 &&
      heartRate.length === 0 &&
      sleep.length === 0
    ) {
      Alert.alert(
        "Something Wrong",
        "Please check permissions. Go to Settings > Health > Data Access & Devices > Lusie.",
        [
          {
            text: "Go to settings",
            onPress: () => {
              handleRevokeAccess();
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    }
  }

  const handleRevokeAccess = async () => {
    try {
      const settingsUrl = "app-settings:";
      const supported = await Linking.canOpenURL(settingsUrl);
      if (supported) {
        await Linking.openURL(settingsUrl);
      } else {
        await Linking.openURL("app-settings:");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to open Settings. Please go to Settings > Health > Data Access & Devices > Lusie."
      );
      console.error("Error opening Settings:", error);
    }
  };

  const SyncDataView = () => (
    <View style={styles.syncDataView}>
      <Text style={styles.heading}>Synced Health Data</Text>
      <Text style={styles.timestampText}>
        Last Update on: {dataTimestamp ?? "--"}
      </Text>
      <View style={[styles.dataContainer, { backgroundColor: "#FF890470" }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="footsteps-sharp" size={36} color="black" />
          <Text style={styles.heading}>Steps</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{steps || "--"}</Text>
          <Text style={styles.unitText}>Steps</Text>
        </View>
      </View>
      <View style={[styles.dataContainer, { backgroundColor: "#FF646770" }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="heart" size={36} color="black" />
          <Text style={styles.heading}>Heart Rate</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{getLatestHeartRate(heartRate)}</Text>
          <Text style={styles.unitText}>bmp</Text>
        </View>
      </View>
      <View style={[styles.dataContainer, { backgroundColor: "#A684FF70" }]}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="local-fire-department" size={36} color="black" />
          <Text style={styles.heading}>Calories</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{calories || "--"}</Text>
          <Text style={styles.unitText}>Kcal</Text>
        </View>
      </View>
      <View style={[styles.dataContainer, { backgroundColor: "#21BCFF70" }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="bed" size={36} color="black" />
          <Text style={styles.heading}>Sleep</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{getTotalSleep(sleep)}</Text>
          <Text style={styles.unitText}>hrs</Text>
        </View>
      </View>
    </View>
  );

  const NoDataView = () => (
    <View style={styles.noDataView}>
      <Text style={styles.heading}>No sync data available</Text>
      <Text style={styles.subHeading}>
        Connect with your Apple Health to see insights here.
      </Text>
      <TouchableOpacity style={styles.syncBtn} onPress={onPress}>
        <Text style={styles.syncBtnText}>Sync Data</Text>
      </TouchableOpacity>
    </View>
  );

  const BottomActions = () => (
    <View style={styles.bottomActions}>
      <TouchableOpacity
        style={styles.revokeBtn}
        onPress={() => {
          Alert.alert(
            "Revoke Access",
            "Please go to Settings > Health > Data Access & Devices > Lusie.",
            [
              {
                text: "Go to settings",
                onPress: () => {
                  handleRevokeAccess();
                },
              },
              {
                text: "Cancel",
                style: "cancel",
              },
            ]
          );
        }}
      >
        <Text style={styles.revokeBtnText}>Revoke Access</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.refreshBtn} onPress={refetch}>
        <MaterialIcons name="refresh" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainConatainer}>
      {hasPermissions && success && !error ? SyncDataView() : NoDataView()}
      {hasPermissions && success && !error ? BottomActions() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mainConatainer: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  syncDataView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  noDataView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  heading: {
    fontSize: 22,
    color: "#000000",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  subHeading: {
    fontSize: 18,
    color: "#808080",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  syncBtn: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    paddingHorizontal: 32,
    justifyContent: "center",
    backgroundColor: "#0000FF",
  },
  syncBtnText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Poppins",
    textAlign: "center",
  },
  dataContainer: {
    width: "100%",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
  },
  iconContainer: {
    alignItems: "flex-start",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 5,
  },
  valueText: {
    fontSize: 30,
    color: "#000000",
    fontFamily: "Poppins",
  },
  unitText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#000000",
    marginLeft: 5,
    marginBottom: 5,
  },
  bottomActions: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 30,
  },
  refreshBtn: {
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000000",
  },
  revokeBtn: {
    flex: 1,
    padding: 13,
    borderRadius: 12,
    backgroundColor: "#0000FF",
  },
  revokeBtnText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  timestampText: {
    fontSize: 14,
    color: "#808080",
    textAlign: "center",
    fontFamily: "Poppins",
  },
});
