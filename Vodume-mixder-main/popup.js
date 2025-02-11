document.addEventListener('DOMContentLoaded', async () => {
  const tabsContainer = document.getElementById('tabs-container');
  
  // Get all active tabs
  const tabs = await chrome.tabs.query({ audible: true });

  if (tabs.length === 0) {
    tabsContainer.innerHTML = '<p>No audible tabs found.</p>';
    return;
  }

  // Create a slider for each tab
  tabs.forEach((tab) => {
    const tabItem = document.createElement('div');
    tabItem.className = 'tab-item';

    const tabTitle = document.createElement('span');
    tabTitle.textContent = tab.title;

    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = '100'; // Default to full volume

    const volumeValue = document.createElement('span');
    volumeValue.textContent = '100';
    volumeValue.className = 'volume-value';

    // Listen for slider changes and send a message to adjust volume
    volumeSlider.addEventListener('input', (event) => {
      const volume = event.target.value;
      volumeValue.textContent = `${volume}%`;

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (volume) => {
          const videos = document.querySelectorAll('video, audio');
          videos.forEach((media) => (media.volume = volume / 100));
        },
        args: [volume],
      });
    });

    tabItem.appendChild(tabTitle);
    tabItem.appendChild(volumeSlider);
    tabItem.appendChild(volumeValue);
    tabsContainer.appendChild(tabItem);
  });
});
