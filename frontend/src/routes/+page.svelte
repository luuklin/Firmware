<script lang="ts">
  import { browser } from '$app/environment';
  import { SerializeAccountLinkCommand } from '$lib/Serializers/AccountLinkCommand';
  import { SerializeSetRfTxPinCommand } from '$lib/Serializers/SetRfTxPinCommand';
  import { SerializeActionCommand } from '$lib/Serializers/ActionCommand';
  import { WebSocketClient } from '$lib/WebSocketClient';
  import WiFiList from '$lib/components/WiFiList.svelte';
  import { DeviceStateStore } from '$lib/stores';

  function isValidLinkCode(str: string) {
    if (typeof str != 'string') return false;

    for (var i = 0; i < str.length; i++) {
      if (str[i] < '0' || str[i] > '9') return false;
    }

    return true;
  }

  let linkCode: string = '';
  $: linkCodeValid = isValidLinkCode(linkCode);

  let rfTxPin: number | null = $DeviceStateStore.config?.rf.txPin ?? null;
  $: rfTxPinValid = rfTxPin !== null && rfTxPin >= 0 && rfTxPin < 255;

  function linkAccount() {
    if (!linkCodeValid) return;
    const data = SerializeAccountLinkCommand(linkCode!);
    WebSocketClient.Instance.Send(data);
  }

  //   function performAction() {
  //     /*
  //   Stop = 0,
  //   Shock = 1,
  //   Vibrate = 2,
  //   Sound = 3,
  // */
  //     const data = SerializeActionCommand(2, 100, 25);
  //     WebSocketClient.Instance.Send(data);
  //   }

  let intensityValue = 255;
  let durationValue = 255;
  let actionZap = true;
  let settingsShown = false;

  function swapPage(){
    settingsShown = !settingsShown;
    let settingsDiv = document.getElementById("SettingsDiv");
    let shockDiv = document.getElementById("ShockDiv");
    if (settingsShown){
      shockDiv.style["display"] = "none"
      settingsDiv.style["display"] = "inline"
    } else {
      shockDiv.style["display"] = "inline"
      settingsDiv.style["display"] = "none"
    }
  }
  function performAction() {
    const data = SerializeActionCommand(actionZap ? 1 : 2, 255 - intensityValue, 255 - durationValue);
    WebSocketClient.Instance.Send(data);
  }
  function switchMode() {
    actionZap = !actionZap;
  }
  function performBeep() {
    const data = SerializeActionCommand(3, 1, 10);
    WebSocketClient.Instance.Send(data);
  }
  function performStop() {
    const data = SerializeActionCommand(0, 0, 0);
    WebSocketClient.Instance.Send(data);
  }

  function setRfTxPin() {
    if (!rfTxPinValid) return;
    const data = SerializeSetRfTxPinCommand(rfTxPin!);
    WebSocketClient.Instance.Send(data);
  }
</script>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    grid-template-rows: 3fr 1fr 1fr 1fr;
    grid-column-gap: 2%;
    grid-row-gap: 2%;
    height: 90vh;
    width: 90vw;
    color: black;
    font-size: 2em;

    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);

    touch-action: none;
  }

  .btn {
    border-radius: 0;
    background-color: #FFEE24;

  }

  .slider {
    appearance: none;
    writing-mode: vertical-lr;
    background-color: black;
    margin: auto;
    width: 70%;
    height: 100%;
    outline-color: #FFEE24;
    outline-style: solid;
    outline-width: 1%;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: #FFEE24;
    width: 23vw;
    height: 23vw;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    appearance: none;
    background-color: #FFEE24;
    width: 23vw;
    height: 23vw;
    cursor: pointer;
  }

  .spanText {
    display: flex;
    justify-content: center;
    color: #FFEE24;
    margin: auto;
  }
</style>

<div class="shockPage" style="height: 100%; overflow: hidden;">
  <div>

    <div id="SettingsDiv" style="display: none">
      <WiFiList />

      <div class="flex flex-col space-y-2">
        <h3 class="h3">Account Linking</h3>
        <div class="flex space-x-2">
          <input class={'input variant-form-material ' + (linkCodeValid ? '' : 'input-error')} type="text" inputmode="numeric" pattern="[0-9]*" placeholder="Link Code" bind:value={linkCode} />
          <button class="btn variant-filled" on:click={linkAccount} disabled={!linkCodeValid || linkCode.length < 6}>Link</button>
        </div>
      </div>

      <div class="flex flex-col space-y-2">
        <div class="flex flex-row space-x-2 items-center">
          <h3 class="h3">RF TX Pin</h3>
          <span class="text-sm text-gray-500">(Currently {$DeviceStateStore.config == null ? ' not set' : $DeviceStateStore.config.rf.txPin}) </span>
        </div>
        <div class="flex space-x-2">
          <input class="input variant-form-material" type="number" placeholder="TX Pin" bind:value={rfTxPin} />
          <button class="shockButton" on:click={setRfTxPin} disabled={!rfTxPinValid}>Set</button>
        </div>
      </div>
    </div>

    <div id="ShockDiv">
      <div class="container">
        <input id="intensitySlider" type="range" min="0" max="255" class="slider" style="grid-area: 1 / 1 / 4 / 2" bind:value={intensityValue} />
        <input id="durationSlider" type="range" min="0" max="255" class="slider" style="grid-area: 1 / 2 / 4 / 3" bind:value={durationValue} />
        <span id="intensityText" class="spanText" style="grid-area: 4 / 1 / 5 / 2">{(((255 - intensityValue) / 255.0) * 100.0).toFixed(0) + '%'}</span>
        <span id="durationText" class="spanText" style="grid-area: 4 / 2 / 5 / 3">{(((255 - durationValue) / 255) * 15).toFixed(1) + 's'}</span>
        
        <button id="performActionButton" class="btn" style="grid-area: 1 / 3 / 2 / 4" on:click={performAction}>{actionZap ? 'Zap' : 'Vibrate'}</button>
        <button id="switchModeButton" class="btn" style="grid-area: 2 / 3 / 3 / 4" on:click={switchMode}>Switch Mode</button>
        <button id="beepButton" class="btn" style="grid-area: 3 / 3 / 4 / 4" on:click={performBeep}>Beep</button>
        <button id="stopButton" class="btn" style="grid-area: 4 / 3 / 5 / 4" on:click={performStop}>Stop</button>
      </div>
    </div>

  </div>
</div>
