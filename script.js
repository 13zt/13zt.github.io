(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initLetter() {
    var scene = document.querySelector("[data-letter-scene]");
    var button = document.querySelector("[data-open-letter]");

    if (!scene || !button) return;

    function openLetter() {
      scene.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }

    button.addEventListener("click", openLetter);

    window.setTimeout(openLetter, reduceMotion ? 0 : 700);
  }

  function initTyping() {
    var target = document.querySelector("[data-type-text]");

    if (!target) return;

    var text = target.getAttribute("data-type-text") || target.textContent;
    target.textContent = "";
    target.classList.add("typing-caret");

    if (reduceMotion) {
      target.textContent = text;
      target.classList.remove("typing-caret");
      return;
    }

    var index = 0;
    var timer = window.setInterval(function () {
      target.textContent += text.charAt(index);
      index += 1;

      if (index >= text.length) {
        window.clearInterval(timer);
        window.setTimeout(function () {
          target.classList.remove("typing-caret");
        }, 900);
      }
    }, 180);
  }

  function initSparks() {
    var canvas = document.querySelector("[data-spark-canvas]");
    var button = document.querySelector("[data-spark-button]");

    if (!canvas || reduceMotion) return;

    var ctx = canvas.getContext("2d");
    var width = 0;
    var height = 0;
    var sparks = [];
    var colors = ["#d95f76", "#277a7a", "#405f9b", "#cf9b3a"];

    function resize() {
      var ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function addSparks(amount) {
      for (var i = 0; i < amount; i += 1) {
        sparks.push({
          x: width * (0.22 + Math.random() * 0.58),
          y: height * (0.24 + Math.random() * 0.22),
          vx: (Math.random() - 0.5) * 1.8,
          vy: Math.random() * -1.6 - 0.4,
          size: Math.random() * 4 + 2,
          life: Math.random() * 70 + 70,
          color: colors[Math.floor(Math.random() * colors.length)],
          turn: Math.random() * 0.08 - 0.04
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (var i = sparks.length - 1; i >= 0; i -= 1) {
        var spark = sparks[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.025;
        spark.vx += spark.turn;
        spark.life -= 1;

        ctx.globalAlpha = Math.max(spark.life / 120, 0);
        ctx.fillStyle = spark.color;
        ctx.save();
        ctx.translate(spark.x, spark.y);
        ctx.rotate(spark.life / 18);
        ctx.fillRect(-spark.size / 2, -spark.size / 2, spark.size, spark.size);
        ctx.restore();

        if (spark.life <= 0) {
          sparks.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      window.requestAnimationFrame(draw);
    }

    resize();
    addSparks(32);
    draw();

    window.addEventListener("resize", resize);

    if (button) {
      button.addEventListener("click", function () {
        addSparks(90);
      });
    }
  }

  initLetter();
  initTyping();
  initSparks();
})();
