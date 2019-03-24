const reloadWaitSeconds = 10;
let previousTime = -1.0;

const videoElementClass = '.video-stream.html5-main-video';
const video = document.querySelector(videoElementClass) as HTMLVideoElement;

verboseLog('YouTube video auto reloader active.');
const pollingFunc = getPollingFunc(video);
pollingFunc();

function getPollingFunc(video: HTMLVideoElement): Function {
  return () => {
    if (isProgressVideo(video)) {
      // store current position (time)
      previousTime = video.currentTime;

      getConfigValue('intervalSeconds', (interval: number) => {
        verboseLog('alive video. next check after %d seconds', interval);
        setTimeout(pollingFunc, interval * 1000);
      });
    } else {
      verboseLog('Freeze video. reload tab after %d seconds.', reloadWaitSeconds);
      setTimeout(reloadTab, reloadWaitSeconds * 1000);
    }
  };
}

function isProgressVideo(video: HTMLVideoElement): boolean {
  // always alive video paused
  if (video.paused) return true;

  const currentTime = video.currentTime;
  verboseLog('previousTime: %f : currentTime: %f', previousTime, currentTime);

  return previousTime < currentTime;
}

function reloadTab(): void {
  window.location.reload();
}

function verboseLog(...args: any): void {
  getConfigValue('isVerbose', (isVerbose: boolean) => {
    if (!isVerbose) return;
    // add prefix to log message
    args[0] = '[yt-ar] ' + args[0];
    console.debug.apply(console, args);
  });
}

function getConfigValue(key: string, callback: Function): void {
  chrome.storage.sync.get(key, result => {
    const value = result[key];
    callback(value);
  });
}
