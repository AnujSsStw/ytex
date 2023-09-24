async function onDOMContentLoaded() {
  var getYoutubeIdByUrl = function (url) {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[7].length == 11) {
      return match[7];
    }

    return false;
  };

  async function access() {
    var videos = document.querySelectorAll(
      ".yt-simple-endpoint.style-scope.ytd-playlist-video-renderer"
    );
    var r = [];
    var json = [];

    r.forEach.call(videos, function (video) {
      var url =
        video.getAttribute("title") +
        "   " +
        "https://www.youtube.com" +
        video.getAttribute("href");
      url = url.split("&list=WL&index=");
      url = url[0].split("   ")[1];

      const yt_video_id = getYoutubeIdByUrl(url);
      if (yt_video_id) {
        json.push(yt_video_id);
      }
    });

    const lastFirstVideo = await chrome.storage.local.get(["firstVideo"]);

    if (lastFirstVideo.firstVideo !== undefined) {
      for (let i = 0; i < json.length; i++) {
        const element = json[i];

        if (element === lastFirstVideo.firstVideo) {
          json = json.slice(0, i);
          setLastIdx(json[0]);
          break;
        }
      }
    }

    const a = await chrome.storage.local.get(["savedKey"]);

    fetch("https://calculating-chinchilla-85.convex.site/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: json,
        apiKey: a.savedKey,
      }),
    })
      .then((res) => {
        setLastIdx(json[0]);
        console.log(res);
        indicator();
      })
      .catch((error) => {
        // Handle errors
        console.log("error", error);
      });
  }

  function getDocHeight() {
    var D = document;
    return Math.max(
      Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
      Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
      Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
  }

  async function scrollToBottomAndDoTask() {
    var videos = document.querySelectorAll(
      ".yt-simple-endpoint.style-scope.ytd-playlist-video-renderer"
    );
    console.log("vv: ", TotalVideosInt - videos.length);
    if (TotalVideosInt - videos.length < 20) {
      clearInterval(id);
      await access();
      return;
    }
    window.scroll(0, getDocHeight());
    console.log("scrolled");
  }

  function indicator() {
    alert("Done! Check your email for the results.");
    window.location.href = "https://www.youtube.com/";
  }

  console.log("Content script is running on this page.");
  const TotalVideos = document.querySelector(
    "#page-manager > ytd-browse > ytd-playlist-header-renderer > div > div.immersive-header-content.style-scope.ytd-playlist-header-renderer > div.thumbnail-and-metadata-wrapper.style-scope.ytd-playlist-header-renderer > div > div.metadata-action-bar.style-scope.ytd-playlist-header-renderer > div.metadata-text-wrapper.style-scope.ytd-playlist-header-renderer > ytd-playlist-byline-renderer > div > yt-formatted-string:nth-child(2) > span:nth-child(1)"
  ).innerText;

  const TotalVideosInt = parseInt(TotalVideos);
  console.log(TotalVideosInt);

  var id = setInterval(scrollToBottomAndDoTask, 5000);
}

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.msg === "start") {
    await onDOMContentLoaded();

    await sortToNewest();
    alert("Started! Please wait until the process is finished.");
  }
});

async function sortToNewest() {
  const element = document.querySelector(
    "div#icon-label.style-scope.yt-dropdown-menu"
  );
  const innerDropdownMenu = document.querySelectorAll(
    "div.item.style-scope.yt-dropdown-menu"
  );

  let e;
  for (const element of innerDropdownMenu) {
    if (element.textContent.includes("Date added (newest)")) {
      e = element;
      break; // Assuming you want to find the first matching element and stop searching.
    }
  }

  if (element) {
    element.click();

    // Wait for a brief moment and select "Newest" (you may need to adjust the delay)
    new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
      if (e) {
        e.click();
        document.querySelector("body").click();
      } else {
        console.error(
          "Inner dropdown menu not found. Please check the XPath or page structure."
        );
      }
    });
  }
}

function setLastIdx(id) {
  chrome.storage.local.set({ firstVideo: id }, function () {
    console.log("First video saved:", id);
  });
}
