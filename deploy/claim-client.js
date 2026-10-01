/**
 * QPF claim intake + status client.
 *
 * One file drives both pages by element presence:
 *   /verification-request.html  — #claimForm        (submit a claim)
 *   /claim-status.html          — #claimStatusRoot  (private status link)
 *
 * No email. No account. The status token lives in the URL fragment (#t=...)
 * and is never sent to the server as part of a page navigation.
 * All customer-supplied text is rendered via textContent — never innerHTML.
 */
(function () {
  "use strict";

  var API = "/api/claim";
  var MAX_LINKS = 5;

  function $(id) { return document.getElementById(id); }

  function show(el, text) {
    if (!el) return;
    el.textContent = text;
    el.hidden = false;
  }

  /* ---------------- submission form ---------------- */

  var form = $("claimForm");
  if (form) {
    var errEl = $("claimError");
    var doneEl = $("claimDone");
    var submitBtn = $("claimSubmit");

    function readLinks() {
      return ($("claimLinks").value || "")
        .split(/\r?\n/)
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errEl) errEl.hidden = true;

      var payload = {
        project: ($("claimProject").value || "").trim(),
        claim: ($("claimClaim").value || "").trim(),
        links: readLinks(),
        decision: ($("claimDecision").value || "").trim(),
        company: ($("claimCompany") || {}).value || ""
      };

      // Mirror the server's rules so the person gets instant, honest feedback.
      if (payload.links.length > MAX_LINKS) {
        show(errEl, "At most " + MAX_LINKS + " reference links, one per line.");
        return;
      }
      if (payload.claim.length < 80) {
        show(errEl, "Describe the claim in at least 80 characters so it can be tested.");
        return;
      }
      if (payload.links.length < 1) {
        show(errEl, "Add at least one public reference link (http/https).");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting…";

      fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok || !data.ok) {
              throw new Error(data.error || "Submission failed (" + res.status + ").");
            }
            return data;
          });
        })
        .then(function (data) {
          form.hidden = true;
          if (!doneEl) return;
          var link = location.origin + data.statusUrl;
          $("claimDoneRef").textContent = data.ref;
          $("claimDoneLink").value = link;
          doneEl.hidden = false;
          doneEl.focus();
        })
        .catch(function (err) {
          show(errEl, err.message || "Network error — nothing was submitted. Try again.");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit my claim";
        });
    });

    var copyBtn = $("claimCopyBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var input = $("claimDoneLink");
        input.select();
        input.setSelectionRange(0, 99999);
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        if (navigator.clipboard && !ok) {
          navigator.clipboard.writeText(input.value).then(function () {
            copyBtn.textContent = "Copied";
          });
          return;
        }
        copyBtn.textContent = ok ? "Copied" : "Press Ctrl+C";
      });
    }
  }

  /* ---------------- status page ---------------- */

  var root = $("claimStatusRoot");
  if (root) {
    var stateEl = $("csState");
    var dataEl = $("csData");
    var timelineEl = $("csTimeline");
    var resultEl = $("csResult");

    var STAGES = [
      { key: "received", label: "Received — your claim is in the intake queue." },
      { key: "checking", label: "Checking — reviewed against public evidence." },
      { key: "complete", label: "Result — verified / not established / unknown, with method and limits." }
    ];
    var LABELS = {
      received: "Received",
      checking: "Checking",
      declined: "Declined at intake",
      complete: "Result ready"
    };

    var match = /^#t=([0-9a-f]{32})$/.exec(location.hash || "");
    if (!match) {
      show(stateEl, "This page needs your private status link. It looks like claim-status.html#t=… — open the exact link you received when you submitted. Links cannot be guessed, and QPF never sees yours.");
      dataEl.hidden = true;
    } else {
      fetch(API + "?t=" + match[1])
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok || !data.ok) {
              throw new Error(data.error || "Status lookup failed (" + res.status + ").");
            }
            return data;
          });
        })
        .then(function (data) {
          var c = data.claim;
          show(stateEl, "Reference " + c.ref + " · status: " +
            (LABELS[c.status] || c.status) + " · updated " +
            new Date(c.updatedAt).toISOString().replace("T", " ").slice(0, 19) + " UTC");

          // Timeline
          timelineEl.innerHTML = "";
          var declined = c.status === "declined";
          var stageIndex = c.status === "complete" ? 2
            : c.status === "checking" ? 1
            : declined ? -1 : 0;
          STAGES.forEach(function (stage, i) {
            var li = document.createElement("li");
            var done = !declined && i < stageIndex;
            var current = !declined && i === stageIndex;
            li.className = "border border-white/10 rounded-lg px-4 py-3 bg-white/5" +
              (current ? " border-orange-500/50" : "");
            li.textContent = (done ? "✓ " : current ? "● " : "○ ") + stage.label;
            if (!done && !current) li.style.opacity = "0.5";
            timelineEl.appendChild(li);
          });
          if (declined) {
            var li2 = document.createElement("li");
            li2.className = "border border-amber-500/40 rounded-lg px-4 py-3 bg-amber-500/10";
            li2.textContent = "Declined at intake — the claim could not be tested against public artifacts. No charge is raised.";
            timelineEl.appendChild(li2);
          }

          // Claim details (textContent only — customer-supplied strings)
          $("csProject").textContent = c.project;
          $("csClaim").textContent = c.claim;
          $("csDecision").textContent = c.decision;
          var listEl = $("csLinks");
          listEl.innerHTML = "";
          (c.links || []).forEach(function (href) {
            var a = document.createElement("a");
            a.href = href;
            a.textContent = href;
            a.rel = "nofollow noopener";
            a.target = "_blank";
            a.className = "block text-orange-400 hover:underline break-all text-sm";
            var li = document.createElement("li");
            li.appendChild(a);
            listEl.appendChild(li);
          });

          // Result
          if (c.status === "complete" && c.result) {
            resultEl.hidden = false;
            var r = c.result;
            [
              ["csVerified", r.verified],
              ["csUnverified", r.unverified],
              ["csUnknown", r.unknown]
            ].forEach(function (pair) {
              var ul = $(pair[0]);
              ul.innerHTML = "";
              (pair[1] || []).forEach(function (item) {
                var line = document.createElement("li");
                line.textContent = item;
                ul.appendChild(line);
              });
            });
            $("csMethod").textContent = r.method || "";
            $("csLimits").textContent = r.limits || "";
            var receipt = $("csReceipt");
            if (r.receiptUrl) {
              receipt.href = r.receiptUrl;
              receipt.hidden = false;
            }
          } else if (c.status === "complete") {
            resultEl.hidden = false;
            $("csVerified").innerHTML = "";
            $("csUnverified").innerHTML = "";
            $("csUnknown").innerHTML = "";
            $("csMethod").textContent = "Result recorded as complete; published detail is being added to the receipt index.";
            $("csLimits").textContent = "";
            $("csReceipt").hidden = true;
          }

          dataEl.hidden = false;
        })
        .catch(function (err) {
          show(stateEl, err.message || "Could not load status — try again shortly.");
          dataEl.hidden = true;
        });
    }
  }
})();

