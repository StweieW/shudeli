(() => {
  "use strict";

  const presentation = document.getElementById("presentation");
  const hud = document.getElementById("hud");
  const deck = document.getElementById("deck");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const total = slides.length;

  const sceneCurrent = document.getElementById("sceneCurrent");
  const sceneTotal = document.getElementById("sceneTotal");
  const sceneName = document.getElementById("sceneName");
  const progressBar = document.getElementById("progressBar");
  const nextLabel = document.getElementById("nextLabel");
  const stepIndicator = document.getElementById("stepIndicator");
  const prevButton = document.querySelector('[data-action="prev"]');
  const announcer = document.getElementById("announcer");

  const outlineOverlay = document.getElementById("outlineOverlay");
  const outlineGrid = document.getElementById("outlineGrid");
  const notesPanel = document.getElementById("notesPanel");
  const notesTitle = document.getElementById("notesTitle");
  const notesCue = document.getElementById("notesCue");
  const notesBody = document.getElementById("notesBody");
  const helpModal = document.getElementById("helpModal");
  const meetingVideo = document.getElementById("meetingVideo");

  const darkScenes = new Set([
    "cover",
    "chapter-one",
    "response",
    "film",
    "chapter-three",
    "two-times",
    "legacy",
    "closing",
  ]);

  const speakerNotes = {
    cover: {
      title: "封面",
      cue: "先停两秒，目光扫全场。前半段轻快带笑；念到“二十八岁”之后放慢，声音沉下来。",
      body:
        "各位老师、同学，大家好。\n\n先做一道心算题：在座各位的平均年龄，大概是十九岁。\n\n现在，请把时间拨回一百零五年前。1921年夏天，上海一间闷热的石库门客厅里，坐着十三位代表，他们的平均年龄是——二十八岁。",
    },
    people: {
      title: "他们来时，正年轻",
      cue: "先请观众猜年龄，再逐张点击照片揭晓。点到“开一次会，就可能掉脑袋”时停一拍。",
      body:
        "来认识三个人。刘仁静，十九岁；邓恩铭，二十岁；毛泽东，二十八岁。\n\n他们面对的，是积贫积弱的旧中国，是租界里随时可能降临的搜捕。开一次会，就可能掉脑袋，可他们还是来了。\n\n故事，从1921年7月30日的晚上说起。",
    },
    "chapter-one": {
      title: "惊魂一夜",
      cue: "章节页一闪而过，不停留。压低声音，像讲悄悄话。",
      body: "这是一个普通的夏夜，也是一次改变中国的会议。危险，正在门外靠近。",
    },
    "the-night": {
      title: "1921年7月30日",
      cue: "“前门被推开了”单独成句，说完停一拍，再切到下一页。",
      body:
        "1921年7月30日，晚上八点多，法租界望志路106号，也就是今天的兴业路76号。\n\n楼下客厅里闷热无风，会议已经开到第六次，大家正围着党的纲领反复讨论。\n\n就在这时，前门被推开了。",
    },
    response: {
      title: "片刻之间，一个决定",
      cue: "灰色长衫人、马林、撤离四步依次点亮。马林拍板那句要干脆。",
      body:
        "一个穿灰色长衫的陌生男人闯了进来。他没有敲门，目光在屋里一扫：一张张年轻的脸，一份份摊开的文件。\n\n马林一眼看出不对：这个人，很可能是租界巡捕房的密探。\n\n“立刻休会，马上撤离，一分钟都不能耽误！”\n\n这个决定，是在陌生人转身离开的片刻之间做出的。一个果断判断，保住了一个政党的诞生。",
    },
    aftermath: {
      title: "火种，没有熄灭",
      cue: "开头急促紧张；李汉俊一段放缓、从容；南湖部分语调舒展，像松了一口气。",
      body:
        "十几分钟后，巡捕冲了进来。李汉俊神色平静，沉着应对盘问。一边是枪口，一边是年轻人的镇定。那一刻他守住的，不只是一间屋子，更是一个政党的火种。\n\n随后，代表们转移嘉兴南湖。一个政党，诞生在石库门，完成在红船上。",
    },
    film: {
      title: "回到那个夜晚",
      cue: "播放视频。结束后停一拍，再翻到“历史必然”章节。",
      body:
        "下面，让我们通过影像，生动地体会这场惊心动魄的中共一大会议。",
    },
    "chapter-two": {
      title: "历史必然",
      cue: "章节页一闪而过。进入下一页后，语速平稳，像讲课。",
      body: "也许有同学想问：这么重要的会议，为什么偏偏在上海？为什么偏偏是石库门？",
    },
    reasons: {
      title: "为什么，偏偏是上海？",
      cue: "按“阶级、思想、空间、建筑”逐项展开。每个维度之间停一拍，用手势辅助。",
      body:
        "一，阶级基础。上海是近代中国工业最发达的城市，也是产业工人最集中的城市。\n\n二，思想阵地。《新青年》和《共产党宣言》首个中文全译本都在上海出版，各地建党的联络中心也在这里。\n\n三，空间政治。公共租界、法租界与华界管辖交错，留下统治力量相对薄弱的缝隙。\n\n最后看石库门：前门通街，后门连弄，一有情况，人可以迅速分散。",
    },
    selection: {
      title: "历史选择了上海",
      cue: "四个条件依次点亮。说明红色路径只是撤离方向示意，不表述为唯一路线；最后两句放慢，给“敢于行动的年轻人”留出重音。",
      body:
        "所以，一大在上海召开，不是偶然。有工人阶级的基础，有先进思想的阵地，有可以周旋的缝隙，还有一座撤得出去的房子。\n\n历史选择了上海，上海也成就了历史。\n\n让条件变成现实的，是一群敢于行动的年轻人。",
    },
    "chapter-three": {
      title: "时代回响",
      cue: "章节页一闪而过。从这里开始，语气逐渐有力。",
      body: "一百多年后的今天，兴业路76号仍在回答：这簇火，与今天的我们有什么关系？",
    },
    "two-times": {
      title: "一条街，两种时间",
      cue: "先左右对比新天地与兴业路76号，再抬眼看台下。讲到“我们呢”时稍作停顿。",
      body:
        "今天的兴业路76号，就在新天地旁边。一边是霓虹闪烁，一边是青砖红砖的石库门，两种景象，只隔一条街。\n\n他们不是来打卡历史的，他们是来创造历史的。\n\n那我们呢？当年的青年用二十八岁的肩膀扛起时代，今天的我们，也该扛起这一代人的责任。",
    },
    legacy: {
      title: "历史是用来接续的",
      cue: "语气由低到高。最后两句前停一秒，目光直视台下，收尾后微微鞠躬。",
      body:
        "历史不是用来瞻仰的，是用来接续的。\n\n一百零五年前，一群青年在树德里的夏夜点亮火种；今天，轮到我们，让它继续燃烧。",
    },
    closing: {
      title: "演讲结束",
      cue: "看向全场，停两秒，清楚地说：“谢谢大家。”",
      body: "谢谢大家！",
    },
  };

  let currentIndex = 0;
  let lastFocusedElement = null;
  let idleTimer = 0;
  let wheelAccumulator = 0;
  let wheelLocked = false;
  let touchStartX = 0;
  let touchStartY = 0;

  const clampIndex = (index) => Math.max(0, Math.min(total - 1, index));
  const getSlide = (index) => slides[clampIndex(index)];
  const getSteps = (slide) => Array.from(slide.querySelectorAll(".step"));
  const getVisibleSteps = (slide) =>
    getSteps(slide).filter((step) => step.classList.contains("is-visible"));

  function announce(message) {
    announcer.textContent = "";
    window.setTimeout(() => {
      announcer.textContent = message;
    }, 30);
  }

  function resetSceneSteps(slide, revealAll = false) {
    const steps = getSteps(slide);
    steps.forEach((step) => {
      step.classList.toggle("is-visible", revealAll);
      step.setAttribute("aria-hidden", revealAll ? "false" : "true");
    });
  }

  function resetAgeReveals(slide) {
    slide.querySelectorAll(".portrait-card.is-revealed").forEach((card) => {
      card.classList.remove("is-revealed");
      const button = card.querySelector("[data-reveal-age]");
      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function revealStep(step) {
    step.classList.add("is-visible");
    step.setAttribute("aria-hidden", "false");
  }

  function hideStep(step) {
    step.classList.remove("is-visible");
    step.setAttribute("aria-hidden", "true");
  }

  function updateNextLabel() {
    const slide = getSlide(currentIndex);
    const steps = getSteps(slide);
    const visible = getVisibleSteps(slide);
    const hidden = steps.length - visible.length;

    if (currentIndex === total - 1) {
      nextLabel.textContent = "回到封面";
    } else if (hidden > 0) {
      nextLabel.textContent = "揭示下一步";
    } else if (currentIndex === 0) {
      nextLabel.textContent = "进入故事";
    } else {
      nextLabel.textContent = "下一页";
    }

    stepIndicator.textContent = "";
    prevButton.disabled = currentIndex === 0 && visible.length === 0;
  }

  function updateNotes(slide) {
    const notes = speakerNotes[slide.dataset.scene] || {
      title: slide.dataset.title,
      cue: "按 → 继续。",
      body: "",
    };
    notesTitle.textContent = notes.title;
    notesCue.textContent = notes.cue;
    notesBody.textContent = notes.body;
  }

  function updateOutlineState() {
    outlineGrid.querySelectorAll(".outline-card").forEach((card, index) => {
      const isCurrent = index === currentIndex;
      card.classList.toggle("is-current", isCurrent);
      card.setAttribute("aria-current", isCurrent ? "page" : "false");
    });
  }

  function updateHudTheme(slide) {
    hud.classList.toggle("hud--light", darkScenes.has(slide.dataset.scene));
  }

  function pauseVideo() {
    if (meetingVideo && !meetingVideo.paused) {
      meetingVideo.pause();
    }
  }

  function handleVideoState() {
    meetingVideo.classList.add("is-ready");
  }

  function goTo(index, options = {}) {
    const nextIndex = clampIndex(
      options.wrap && index >= total
        ? 0
        : options.wrap && index < 0
          ? total - 1
          : index,
    );

    if (nextIndex === currentIndex && slides[nextIndex].classList.contains("is-active")) {
      updateNextLabel();
      return;
    }

    const direction = options.direction ?? (nextIndex > currentIndex ? 1 : -1);
    const revealAll = options.revealAll ?? direction < 0;
    const previousSlide = slides[currentIndex];
    const nextSlide = slides[nextIndex];

    if (!nextSlide.dataset.scene.includes("film")) {
      pauseVideo();
    }

    previousSlide.classList.remove("is-active");
    previousSlide.classList.add("is-leaving");
    previousSlide.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
      previousSlide.classList.remove("is-leaving");
    }, 780);

    slides.forEach((slide, slideIndex) => {
      if (slideIndex !== nextIndex && slide !== previousSlide) {
        slide.classList.remove("is-active", "is-leaving");
        slide.setAttribute("aria-hidden", "true");
      }
    });

    resetSceneSteps(nextSlide, true);
    resetAgeReveals(nextSlide);
    currentIndex = nextIndex;
    nextSlide.classList.remove("is-leaving");
    nextSlide.classList.add("is-active");
    nextSlide.setAttribute("aria-hidden", "false");

    sceneCurrent.textContent = String(currentIndex + 1).padStart(2, "0");
    sceneName.textContent = nextSlide.dataset.title || "未命名";
    progressBar.style.width = `${((currentIndex + 1) / total) * 100}%`;

    updateHudTheme(nextSlide);
    updateNotes(nextSlide);
    updateOutlineState();
    updateNextLabel();
    resetIdleTimer();

    if (window.location.hash !== `#${currentIndex + 1}`) {
      history.replaceState(null, "", `#${currentIndex + 1}`);
    }

    announce(`第 ${currentIndex + 1} 页：${nextSlide.dataset.title}`);
  }

  function next() {
    const slide = getSlide(currentIndex);
    const hiddenStep = getSteps(slide).find(
      (step) => !step.classList.contains("is-visible"),
    );

    if (hiddenStep) {
      revealStep(hiddenStep);
      updateNextLabel();
      resetIdleTimer();
      return;
    }

    if (currentIndex >= total - 1) {
      goTo(0, { direction: 1, revealAll: false });
      return;
    }

    goTo(currentIndex + 1, { direction: 1, revealAll: false });
  }

  function previous() {
    const slide = getSlide(currentIndex);
    const visibleSteps = getVisibleSteps(slide);

    if (visibleSteps.length > 0) {
      hideStep(visibleSteps[visibleSteps.length - 1]);
      updateNextLabel();
      resetIdleTimer();
      return;
    }

    if (currentIndex > 0) {
      goTo(currentIndex - 1, { direction: -1, revealAll: true });
    }
  }

  function buildOutline() {
    const fragment = document.createDocumentFragment();
    slides.forEach((slide, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "outline-card";
      button.dataset.goto = String(index);
      button.innerHTML = `
        <span class="outline-card__number">${String(index + 1).padStart(2, "0")}</span>
        <span class="outline-card__title"></span>
      `;
      button.querySelector(".outline-card__title").textContent =
        slide.dataset.title || `第 ${index + 1} 页`;
      fragment.appendChild(button);
    });
    outlineGrid.appendChild(fragment);
  }

  function openOutline() {
    lastFocusedElement = document.activeElement;
    outlineOverlay.classList.add("is-open");
    outlineOverlay.setAttribute("aria-hidden", "false");
    updateOutlineState();
    presentation.classList.remove("is-idle");
    window.clearTimeout(idleTimer);
    outlineOverlay.querySelector(".close-button").focus();
  }

  function closeOutline(restoreFocus = true) {
    outlineOverlay.classList.remove("is-open");
    outlineOverlay.setAttribute("aria-hidden", "true");
    if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
    resetIdleTimer();
  }

  function toggleNotes(force) {
    const shouldOpen =
      typeof force === "boolean" ? force : !notesPanel.classList.contains("is-open");
    notesPanel.classList.toggle("is-open", shouldOpen);
    notesPanel.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
    presentation.classList.remove("is-idle");
    if (shouldOpen) {
      window.clearTimeout(idleTimer);
      notesPanel.querySelector("[data-close-notes]").focus();
    } else {
      resetIdleTimer();
    }
  }

  function openHelp() {
    lastFocusedElement = document.activeElement;
    helpModal.classList.add("is-open");
    helpModal.setAttribute("aria-hidden", "false");
    window.clearTimeout(idleTimer);
    helpModal.querySelector(".close-button").focus();
  }

  function closeHelp(restoreFocus = true) {
    helpModal.classList.remove("is-open");
    helpModal.setAttribute("aria-hidden", "true");
    if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
    resetIdleTimer();
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.warn("Fullscreen is unavailable.", error);
    }
  }

  function closeTopPanel() {
    if (helpModal.classList.contains("is-open")) {
      closeHelp();
    } else if (outlineOverlay.classList.contains("is-open")) {
      closeOutline();
    } else if (notesPanel.classList.contains("is-open")) {
      toggleNotes(false);
    }
  }

  function resetIdleTimer() {
    presentation.classList.remove("is-idle");
    window.clearTimeout(idleTimer);

    const overlayOpen =
      outlineOverlay.classList.contains("is-open") ||
      helpModal.classList.contains("is-open") ||
      notesPanel.classList.contains("is-open");

    if (!overlayOpen) {
      idleTimer = window.setTimeout(() => {
        if (
          !outlineOverlay.classList.contains("is-open") &&
          !helpModal.classList.contains("is-open") &&
          !notesPanel.classList.contains("is-open")
        ) {
          presentation.classList.add("is-idle");
        }
      }, 3200);
    }
  }

  function trapFocus(event, container) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      container.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.offsetParent !== null);

    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleKeydown(event) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }
    if (
      event.key === " " &&
      event.target instanceof Element &&
      event.target.closest("button, summary, a")
    ) {
      return;
    }
    if (event.target === meetingVideo) {
      return;
    }

    if (helpModal.classList.contains("is-open")) {
      trapFocus(event, helpModal);
      if (event.key === "Escape") {
        event.preventDefault();
        closeHelp();
      }
      return;
    }

    if (outlineOverlay.classList.contains("is-open")) {
      trapFocus(event, outlineOverlay);
      if (event.key === "Escape") {
        event.preventDefault();
        closeOutline();
      }
      return;
    }

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ":
        event.preventDefault();
        next();
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        event.preventDefault();
        previous();
        break;
      case "Home":
        event.preventDefault();
        goTo(0, { direction: -1, revealAll: true });
        break;
      case "End":
        event.preventDefault();
        goTo(total - 1, { direction: 1, revealAll: true });
        break;
      case "n":
      case "N":
        event.preventDefault();
        toggleNotes();
        break;
      case "o":
      case "O":
        event.preventDefault();
        openOutline();
        break;
      case "f":
      case "F":
        event.preventDefault();
        toggleFullscreen();
        break;
      case "?":
        event.preventDefault();
        openHelp();
        break;
      case "Escape":
        closeTopPanel();
        break;
      default:
        break;
    }
    resetIdleTimer();
  }

  function handleAction(action) {
    switch (action) {
      case "next":
        next();
        break;
      case "prev":
        previous();
        break;
      case "home":
      case "restart":
        goTo(0, { direction: -1, revealAll: false });
        break;
      case "outline":
        openOutline();
        break;
      case "notes":
        toggleNotes();
        break;
      case "fullscreen":
        toggleFullscreen();
        break;
      case "help":
        openHelp();
        break;
      default:
        break;
    }
  }

  function initEvents() {
    document.addEventListener("click", (event) => {
      const closeOverlayTrigger = event.target.closest("[data-close-overlay]");
      if (closeOverlayTrigger) {
        closeOutline();
        return;
      }

      const closeHelpTrigger = event.target.closest("[data-close-help]");
      if (closeHelpTrigger) {
        closeHelp();
        return;
      }

      const closeNotesTrigger = event.target.closest("[data-close-notes]");
      if (closeNotesTrigger) {
        toggleNotes(false);
        return;
      }

      const outlineCard = event.target.closest("[data-goto]");
      if (outlineCard) {
        const targetIndex = Number(outlineCard.dataset.goto);
        closeOutline(false);
        goTo(targetIndex, { direction: 1, revealAll: true });
        return;
      }

      const ageRevealButton = event.target.closest("[data-reveal-age]");
      if (ageRevealButton) {
        const portraitCard = ageRevealButton.closest(".portrait-card");
        if (portraitCard && !portraitCard.classList.contains("is-revealed")) {
          portraitCard.classList.add("is-revealed");
          ageRevealButton.setAttribute("aria-expanded", "true");
          announce(
            `${portraitCard.dataset.name}，${portraitCard.dataset.age}岁`,
          );
        }
        return;
      }

      const actionButton = event.target.closest("[data-action]");
      if (actionButton) {
        handleAction(actionButton.dataset.action);
      }
    });

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("mousemove", resetIdleTimer, { passive: true });
    document.addEventListener("pointerdown", resetIdleTimer, { passive: true });

    deck.addEventListener(
      "wheel",
      (event) => {
        if (event.target.closest("video")) return;
        if (
          outlineOverlay.classList.contains("is-open") ||
          helpModal.classList.contains("is-open") ||
          notesPanel.classList.contains("is-open")
        ) {
          return;
        }

        event.preventDefault();
        if (wheelLocked || Math.abs(event.deltaY) < 4) return;

        wheelAccumulator += event.deltaY;
        if (Math.abs(wheelAccumulator) < 58) return;

        wheelLocked = true;
        wheelAccumulator > 0 ? next() : previous();
        wheelAccumulator = 0;
        window.setTimeout(() => {
          wheelLocked = false;
        }, 780);
      },
      { passive: false },
    );

    deck.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      },
      { passive: true },
    );

    deck.addEventListener(
      "touchend",
      (event) => {
        if (event.target.closest("video")) return;
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY)) {
          deltaX < 0 ? next() : previous();
        }
      },
      { passive: true },
    );

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        pauseVideo();
      } else {
        resetIdleTimer();
      }
    });

    meetingVideo.addEventListener("loadeddata", handleVideoState);
    meetingVideo.addEventListener("play", resetIdleTimer);
  }

  function initFromHash() {
    const hashIndex = Number.parseInt(window.location.hash.replace("#", ""), 10);
    if (Number.isFinite(hashIndex) && hashIndex >= 1 && hashIndex <= total) {
      const target = hashIndex - 1;
      goTo(target, { direction: 1, revealAll: true });
      return;
    }

    progressBar.style.width = `${(1 / total) * 100}%`;
    sceneTotal.textContent = String(total).padStart(2, "0");
    updateNotes(slides[0]);
    updateHudTheme(slides[0]);
    updateOutlineState();
    updateNextLabel();
    history.replaceState(null, "", "#1");
  }

  function init() {
    buildOutline();
    initEvents();
    sceneTotal.textContent = String(total).padStart(2, "0");
    initFromHash();
    resetIdleTimer();
    document.body.classList.add("is-ready");
  }

  init();
})();
