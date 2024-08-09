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

<div class="flex flex-col items-center justify-center h-full">
  <div class="flex-col space-y-5 w-full max-w-md">
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
        <button class="btn variant-filled" on:click={setRfTxPin} disabled={!rfTxPinValid}>Set</button>
      </div>
    </div>

    <style>
      .container {
        display: grid;
        grid-template-columns: 1fr 1fr 2fr;
        grid-template-rows: 3fr 1fr 1fr 1fr;
        grid-column-gap: 5px;
        grid-row-gap: 5px;
        height: 80vh;
        width: 100vw;
      }

      .slider {
        align-self: center;
        justify-self: center;
        writing-mode: vertical-lr;
        height: 100%;
      }
      .spanText {
        display: flex;
        justify-content: center;
      }
    </style>

    <div class="container">
      <input id="intensitySlider" type="range" min="0" max="255" class="slider" style="grid-area: 1 / 1 / 4 / 2" bind:value={intensityValue} />
      <input id="durationSlider" type="range" min="0" max="255" class="slider" style="grid-area: 1 / 2 / 4 / 3" bind:value={durationValue} />
      <span id="intensityText" class="spanText" style="grid-area: 4 / 1 / 5 / 2">{(((255 - intensityValue) / 255.0) * 100.0).toFixed(1) + '%'}</span>
      <span id="durationText" class="spanText" style="grid-area: 4 / 2 / 5 / 3">{(((255 - durationValue) / 255) * 15).toFixed(1) + 's'}</span>
      <button id="performActionButton" class="btn variant-filled" style="grid-area: 1 / 3 / 2 / 4" on:click={performAction}>{actionZap ? 'Zap' : 'Vibrate'}</button>
      <button id="switchModeButton" class="btn variant-filled" style="grid-area: 2 / 3 / 3 / 4" on:click={switchMode}>Switch Mode</button>
      <button id="beepButton" class="btn variant-filled" style="grid-area: 3 / 3 / 4 / 4" on:click={performBeep}>Beep</button>
      <button id="stopButton" class="btn variant-filled" style="grid-area: 4 / 3 / 5 / 4" on:click={performStop}>Stop</button>
    </div>
    <!-- <div class="items-center">
      <div class="flex flex-col space-y-2">
        <input type="range" class="slider" style="writing-mode: vertical-lr" />
        <input type="range" class="slider" style="writing-mode: vertical-lr" />
        <input type="range" class="slider" style="writing-mode: vertical-lr" />
      </div>

      <div class="flex flex-col space-y-2">
        <button class="btn">Button 1</button>
        <button class="btn">Button 2</button>
        <button class="btn">Button 3</button>
      </div>
    </div> -->
  </div>
</div>
