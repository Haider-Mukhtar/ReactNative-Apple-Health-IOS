import { useEffect, useState } from "react";
import { Platform, NativeModules } from "react-native";
import AppleHealthKit, {
  HealthKitPermissions,
  HealthInputOptions,
  HealthValue,
} from "react-native-health";

const RCTAppleHealthKit = NativeModules.RCTAppleHealthKit;

// Permissions mapping
const PERMISSIONS = AppleHealthKit.Constants?.Permissions ?? {
  ActiveEnergyBurned: "ActiveEnergyBurned",
  Steps: "Steps",
  HeartRate: "HeartRate",
  SleepAnalysis: "SleepAnalysis",
};

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      PERMISSIONS.ActiveEnergyBurned,
      PERMISSIONS.Steps,
      PERMISSIONS.HeartRate,
      PERMISSIONS.SleepAnalysis,
    ],
    write: [],
  },
};

const useHealthData = (date: Date) => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState<HealthValue[]>([]);
  const [sleep, setSleep] = useState<HealthValue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dataTimestamp, setDataTimestamp] = useState<string | null>(null);

  // Guard: ensure platform + native module
  const ensureHealthKitAvailable = (): boolean => {
    if (Platform.OS !== "ios") {
      setError("HealthKit is only available on iOS");
      return false;
    }
    if (!RCTAppleHealthKit) {
      setError("Native HealthKit module not available");
      return false;
    }
    return true;
  };

  // Check/request permissions before any fetch
  const checkAndRequestPermissions = (callback: () => void) => {
    if (!ensureHealthKitAvailable()) return;

    RCTAppleHealthKit.getAuthStatus(permissions, (err: string, results: any) => {
      if (err) {
        setError(`Error checking permissions: ${err}`);
        console.error("Error checking permissions:", err);
        return;
      }

      const readPermissions = permissions.permissions.read;
      const allGranted = readPermissions.every(
        (perm) => results[perm] === 2 // 2 = authorized
      );

      if (allGranted) {
        setHasPermissions(true);
        callback();
      } else {
        RCTAppleHealthKit.initHealthKit(permissions, (initErr: string) => {
          if (initErr) {
            setError(`Error initializing HealthKit: ${initErr}`);
            console.error("Error initializing HealthKit:", initErr);
            return;
          }
          setHasPermissions(true);
          callback();
        });
      }
    });
  };

  // Fetch data once permissions are confirmed
  const fetchData = (fetchOptions: HealthInputOptions) => {
    if (!ensureHealthKitAvailable()) return;
    if (!hasPermissions) {
      setError("Health permissions not granted");
      return;
    }

    setSuccess(false);
    setError(null);

    // Steps
    RCTAppleHealthKit.getStepCount(fetchOptions, (err: any, results: any) => {
      if (err) {
        setError(`Error fetching steps: ${err}`);
        return;
      }
      setSteps(results.value);
      setSuccess(true);
    });

    // Calories
    RCTAppleHealthKit.getActiveEnergyBurned(
      fetchOptions,
      (err: any, results: any[]) => {
        if (err) {
          setError(`Error fetching calories: ${err}`);
          return;
        }
        setCalories(results.reduce((sum, sample) => sum + sample.value, 0));
        setSuccess(true);
      }
    );

    // Heart Rate
    RCTAppleHealthKit.getHeartRateSamples(
      fetchOptions,
      (err: any, results: HealthValue[]) => {
        if (err) {
          setError(`Error fetching heart rate: ${err}`);
          return;
        }
        setHeartRate(results);
        setSuccess(true);
      }
    );

    // Sleep
    RCTAppleHealthKit.getSleepSamples(
      fetchOptions,
      (err: any, results: HealthValue[]) => {
        if (err) {
          setError(`Error fetching sleep: ${err}`);
          return;
        }
        setSleep(results);
        setSuccess(true);
      }
    );

    setDataTimestamp(new Date().toISOString());
  };

  // Core trigger function
  const triggerFetch = () => {
    const options: HealthInputOptions = {
      date: date.toISOString(),
      startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString(),
      endDate: date.toISOString(),
    };

    checkAndRequestPermissions(() => fetchData(options));
  };

  // Hook API
  return {
    steps,
    calories,
    heartRate,
    sleep,
    error,
    hasPermissions,
    success,
    dataTimestamp,
    onPress: triggerFetch,
    refetch: triggerFetch,
  };
};

export default useHealthData;
