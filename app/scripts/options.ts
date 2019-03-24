function save_options(): void {
  const interval = document.getElementById('interval') as HTMLInputElement
  const intervalValue: string = interval.value;
  const intervalSeconds: number = parseInt(intervalValue, 10);

  const verbose = document.getElementById('verbose') as HTMLInputElement
  const isVerbose: boolean = verbose.checked;

  chrome.storage.sync.set({
    intervalSeconds: intervalSeconds,
    isVerbose: isVerbose,
  }, () => {
    const status = document.getElementById('status') as HTMLDivElement;
    status.textContent = 'Options saved.';
    setTimeout(() => status.textContent = '', 3 * 1000);
  });
}

function restore_options(): void {
  chrome.storage.sync.get({
    intervalSeconds: 30,
    isVerbose: false,
  }, function(items) {
    (document.getElementById('interval') as HTMLInputElement).value = items.intervalSeconds.toString();
    (document.getElementById('verbose') as HTMLInputElement).checked = items.isVerbose;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
const saveButton = document.getElementById('save') as HTMLButtonElement;
saveButton.addEventListener('click', save_options);
