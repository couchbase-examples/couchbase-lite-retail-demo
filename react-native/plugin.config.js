const {
  withProjectBuildGradle,
  withXcodeProject,
  withPodfileProperties,
} = require('@expo/config-plugins');

// Function to modify Android build.gradle
function modifyAndroidBuildGradle(config) {
  const lineToAdd = ` apply from: "../node_modules/cbl-reactnative/android/build.gradle"`;
  if (!config.modResults.contents.includes(lineToAdd)) {
    config.modResults.contents += `\n${lineToAdd}`;
    console.debug(config.modResults.contents);
  }
  return config;
}

// Function to modify iOS Xcode project
function modifyXcodeProject(config) {
  const xcodeProject = config.modResults;
  // Example modification: adding a build phase for a script
  // xcodeProject.addBuildPhase([], 'PBXShellScriptBuildPhase', 'Run Script', null, script);
  return config;
}

// Function to modify Podfile properties to include the native module podspec
function includeNativeModulePod(config) {
  return withPodfileProperties(config, async (podConfig) => {
    const podspecPath = `../node_modules/cbl-reactnative/cbl-reactnative.podspec`;
    if (podConfig.modResults.podfileProperties !== undefined && podConfig.modResults.podfileProperties.pod !== undefined) {
      podConfig.modResults.podfileProperties.pod(
          `'cbl-reactnative', :path => '${podspecPath}'`
      );
    }
    return podConfig;
  });
}

module.exports = (config) => {
  config = withProjectBuildGradle(config, (gradleConfig) => {
    return modifyAndroidBuildGradle(gradleConfig);
  });
  config = withXcodeProject(config, (xcodeConfig) => {
    return modifyXcodeProject(xcodeConfig);
  });
  config = includeNativeModulePod(config);
  return config;
};
