/* MandiBook explainer — tiny interactions, no dependencies.
   1) Sticky-nav active-link highlight on scroll.
   2) Smooth scroll for in-page anchors (with reduced-motion respect).
   3) Signature touch: the hero lot-bill "splits itself" — a wheat lot
      is booked, the commission and mandi fee come off, the net to the
      farmer is computed, and the farmer gets paid. A live demo of the
      lot-to-settlement wedge. */

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );
  var sections = links
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var a = byId[e.target.id];
          if (!a) return;
          if (e.isIntersecting) {
            links.forEach(function (l) {
              l.style.color = "";
            });
            a.style.color = "var(--accent)";
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------- 2. Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      ev.preventDefault();
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- 3. Signature: the lot bill splits & settles ---------- */
  var liveTag = document.getElementById("reg-live-tag");
  var caption = document.getElementById("reg-caption");
  var netEl = document.getElementById("reg-collected");   // Net to farmer
  var owesEl = document.getElementById("reg-pending");     // Buyer owes

  if (!liveTag || !caption || !netEl || !owesEl) return;

  // Kishan Verma's wheat lot: 20 qtl @ Rs 2,400 = Rs 48,000 gross.
  // Commission 2.5% = Rs 1,200 · mandi fee 1% = Rs 480 · net = Rs 46,320.
  var GROSS = 48000;
  var NET_TO_FARMER = 46320;

  function rupee(n) {
    return "Rs " + n.toLocaleString("en-IN");
  }

  // Cycle: split computed -> farmer paid -> buyer collection -> reset.
  var stages = [
    {
      tag: "Yours",
      tagClass: "tag--due",
      caption: "Enter weight & rate → commission, fee and net computed instantly.",
      net: NET_TO_FARMER,
      owes: GROSS,
      flash: false
    },
    {
      tag: "Farmer paid ✓",
      tagClass: "tag--paid",
      caption: "Rs 46,320 paid to Kishan — his due clears, voucher issued.",
      net: 0,
      owes: GROSS,
      flash: true
    },
    {
      tag: "Buyer settled ✓",
      tagClass: "tag--paid",
      caption: "Aggarwal Grains clears the Rs 48,000 credit. That's the whole cycle.",
      net: 0,
      owes: 0,
      flash: false
    }
  ];

  var i = 0;

  function applyStage(s) {
    liveTag.textContent = s.tag;
    liveTag.className = "reg-row__tag " + s.tagClass;
    caption.textContent = s.caption;
    netEl.textContent = rupee(s.net);
    owesEl.textContent = rupee(s.owes);
    var commissionRow = liveTag.closest(".reg-row");
    if (commissionRow && s.flash) {
      commissionRow.classList.add("flash");
      setTimeout(function () {
        commissionRow.classList.remove("flash");
      }, 900);
    }
  }

  // If the user prefers reduced motion, show the split end-state once
  // (commission earned, net computed) and don't loop.
  if (reduceMotion) {
    applyStage(stages[0]);
    return;
  }

  // Only animate while the widget is on screen.
  var running = false;
  var timer = null;

  function loop() {
    timer = setTimeout(function () {
      i = (i + 1) % stages.length;
      applyStage(stages[i]);
      loop();
    }, i === 0 ? 2600 : 2000);
  }

  var register = document.querySelector(".register");
  if (!register) return;

  var vis = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!e.isIntersecting && running) {
          running = false;
          clearTimeout(timer);
        }
      });
    },
    { threshold: 0.35 }
  );
  vis.observe(register);
})();
