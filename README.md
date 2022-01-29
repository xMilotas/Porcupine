# Porcupine
Porcupine is a privacy focused voice-assistant based on [Rhasspy](https://rhasspy.readthedocs.io/en/latest/) running on a Raspberry Pi.

This repository contains the initial setup script used to download and deploy the docker container running the Rhasspy image, as well as the webserver code which handles all the major intents. 

## Supported Intents
Currently Porcupine supports: 
- Changing light states across my apartment. (This is all based on 433MHZ sensors plugged into a different Pi)
- Full handling of our grocery shopping list backed by [ToDoIst](https://todoist.com/).
- Full timer functionality with build in fixed-times for laundry, eggs, etc. 
- Full Spotify playback control on my different speaker systems

> Note: Most of these intents are heavily customized towards my usage. Please use this repository more as an inspiration rather than a plug&play version.

## Speech to text
For Speech to text recognition Porcupine used a deployed model of Mozilla's DeepSpeech. This model runs on another Pi in my network and is used to get the audio transcription. 

## Setup
As mentioned all components run on different Raspberry PIs.
![How it looks](/docs/raspberryPISetup.png)

I currently use the [ReSpeaker 4 Mic Array](https://respeaker.io/4_mic_array/) as I found it to work best in regards to audio/speech quality.