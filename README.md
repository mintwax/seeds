# seeds

React-native app that records and plays audio files.

# dev tooling notes

Setting up react-native development on Windows 7

1. install python27
2. install vscode (code editor)
3. install java8
4. install git bash
5. install nodejs
6. install androidstudio, marshmallow sdk, intell haxm 
7. install yarn
8. install genymotion
9. install google play on genymotion - https://www.genymotion.com/help/desktop/faq/#google-play-services

To install app on xiaomi from windows
1. Install adb universal driver 3.0
2. Turn on developer mode, USB debugging
3. Turn off "MIUI optimization" for xiaomi

.bashrc
```
export ANDROID_HOME=/c/Users/Morris/AppData/Local/Android/sdk/
export PATH=$PATH:/c/Python27:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
export PATH=$PATH:/c/Yarn/bin
export JAVA_HOME=/c/Java/jdk1.8.0_121
```

# todo

x genymotion+ui explorer
x add toggle listview to gridview
x add vector icons to project - toggle grid/list
X newest audio should go in to the top left
record - display time in 00:00
record - display recording details (bit rate, sample rate)
record - change record button to Icon.button
record - tap once, will record and change to stop button
record - long press (>1 s) will display cancel on top
cancel - drag finger up, highlight cancel, let go will cancel
record - display audio meter when recording
    http://developer.samsung.com/technical-doc/view.do;jsessionid=CD49A14903D73079243BF98A5567F7F0?v=T000000086
    http://stackoverflow.com/questions/14181449/android-detect-sound-level
    https://www.newventuresoftware.com/blog/record-play-and-visualize-raw-audio-data-in-android
record - adjust mic gain (http://stackoverflow.com/questions/25441166/how-to-adjust-microphone-sensitivity-while-recording-audio-in-android-solved)

separate record and list
list - show how long ago created (2s ago)
add delete, list view - swipe left (https://www.npmjs.com/package/react-native-swipe-list-view)
delete should animate out
edit - add rename
edit - change icon
play - highlight box/row on mouseover
play - highlight box/row onPressDown
play - highlight the box/row during playing
add redux / refactor
add unit tests via jest
add flow check vscode
add persistence (redux middleware)
UI - newest audio should show animate in (http://stackoverflow.com/questions/31997126/animate-listview-items-when-they-are-added-removed-from-datasource)

# future
minimize apk size
work on ios
location - add gps support where recorded
location - in SF, in CA, in China, Earth
add payment support to buy 
