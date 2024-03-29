module.exports = {
    owner: "team-canvas",
    extra: {
        api_url: process.env.API_URL ||"https://huhhu.app",
        eas: {
            projectId: "d506ab00-51ff-46e7-94ca-e2475d1f388e"
        }
    },
    android: {
        package: "app.huhhu",
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
    ],
    packagerOpts: {
        config: "metro.config.js"
    },
};
