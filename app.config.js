const major= 1;
const minor = 0;
const revision = 1;

const versionCode = major*100+minor*10+revision;
module.exports = {
    version: `${major}.${minor}.${revision}`,
    extra: {
        api_url: process.env.API_URL ||"https://huhhu.app",
        eas: {
            projectId: "d506ab00-51ff-46e7-94ca-e2475d1f388e"
        }
    },
    android: {
        package: "app.huhhu",
        versionCode: versionCode
    },
    ios: {
        bundleIdentifier: "app.huhhu",
    },
    plugins: [
        [
            "expo-location",
            {
                locationAlwaysAndWhenInUsePermission: "Allow app.huhhu to use your location."
            }
        ]
    ]
};
