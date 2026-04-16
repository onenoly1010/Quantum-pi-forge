# r/LocalLLaMA Launch Post (Value First, Rule Compliant)

---

**Title:** I got fed up fixing broken local AI setups every 3 days, so I built this self-checking stack

---

Alright, let's be real.

We've all done it:
- See the hot new model drop
- Copy paste 7 commands from some random comment
- Get it working for 2 hours
- Come back 3 days later and Ollama died, Aider broke, Continue forgot every config, and you have no idea why.

Everyone posts "run this one command" guides. No one posts the part where you spend 4 hours debugging why nothing works anymore.

---

### What I actually built after the 12th time this happened:

First, the free stuff you can steal right now that I wish someone had posted:

✅ **Use qwen2.5-coder:14b for coding**. Stop messing around. It beats Llama 3 70B for actual code editing, fits in 16GB RAM perfectly, and will not hallucinate entire functions. On 12GB use the 7B variant.

✅ **Never pip install aider globally**. Always use a venv. 90% of breakages come from pip dependency drift. This is not a tip, this is a rule.

✅ **Ollama will silently die if you don't check it**. It doesn't log errors. It just stops responding. No one tells you this. Check `ollama ps` once an hour.

✅ **Continue will overwrite your config without asking**. Always make a backup first.

✅ **Add a 30 minute cron job that just verifies 4 things**:
  1. Is Ollama running?
  2. Is my model still there?
  3. Is my Aider config intact?
  4. Do I have disk space left?

That last one changed everything. I stopped coming back to broken setups. Now it tells me exactly what died before I even notice.

---

### This is the stack that works reliably for me now:

Ollama + Aider + Continue. Nothing else. No extra wrappers, no fancy UI, no agents that get stuck in loops. Just code editing that works offline.

I've tuned every config, tested every memory setting, removed all the garbage that breaks, and wrote an installer that actually detects your RAM and picks the right model for you.

It's not magic. It's just the boring, unglamorous maintenance work no one posts about.

If you just want to stop fighting your tools and actually get coding, I packaged the whole thing up properly:

👉 [Offine Dev Guardian on Gumroad]

It's $29. All the configs, the one command installer, the Guardian health checker, the aliases, and zero monthly bills. No API keys ever leave your machine.

If you don't want to pay, that's fine too. The 5 bullet points above will already fix 90% of your problems. I hope they help you.

---

P.S. This is for Ubuntu / Mint only right now. Works perfectly on 22.04 and Mint 22.

P.P.S. I'm not posting this every day. This is the only time I'll mention it.

---

### Reddit Posting Notes:
- Add 1 screenshot of clean `forge-status` output
- Add 1 screenshot of the Guardian log
- Do not reply to comments for first 2 hours
- Answer all technical questions honestly
- Do not argue with anyone about pricing
- If someone says "I could build this in 10 minutes" reply: "Great! You should. Then you'll understand why I spent 3 weeks on edge cases."

This post follows the 1/10 self-promo rule exactly: 90% free valuable tips, 10% natural product mention at the end.