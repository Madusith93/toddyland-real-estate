'use client'

import { useEffect } from 'react'

// Google Translate's widget adds a class (e.g. "translated-ltr") to <html>
// and pairs it with a rule in its own injected <style> tag — something like
// `.translated-ltr body { margin-top: 40px !important; }` — to make room
// for its banner. Because that's a class-based external stylesheet rule
// (not an inline style Google sets directly), clearing inline styles does
// nothing: there was never an inline style to clear.
//
// The fix: force our own override via inline style with !important. Per the
// CSS cascade, a JS-set inline style is treated as higher specificity than
// any selector-based rule, so this wins even against Google's own
// !important class rule, regardless of DOM/stylesheet order.
const OFFSET_PROPERTIES: Array<[string, string]> = [
  ['top', '0px'],
  ['margin-top', '0px'],
  ['position', 'static'],
]

function forceReset(el: HTMLElement) {
  OFFSET_PROPERTIES.forEach(([prop, value]) => {
    const alreadyCorrect =
      el.style.getPropertyValue(prop) === value &&
      el.style.getPropertyPriority(prop) === 'important'
    if (!alreadyCorrect) {
      el.style.setProperty(prop, value, 'important')
    }
  })
}

// In addition to shifting <html>/<body> back to top: 0, Google also injects
// a separate toolbar/banner div (the language-switcher bar with a close
// button) directly into the page. Repositioning <body> doesn't remove this
// div — it still takes up layout space above our content. We hide it
// directly here. It has no stable class name, so we identify it by its
// inline-style signature (border-bottom + z-index: 10, injected only when
// <html> carries a "translated-ltr"/"translated-rtl" class).
function hideTranslateBanner() {
  const html = document.documentElement
  const isTranslated =
    html.classList.contains('translated-ltr') || html.classList.contains('translated-rtl')
  if (!isTranslated) return

  const candidates = document.body.querySelectorAll<HTMLElement>('div[style*="z-index: 10"]')
  candidates.forEach((el) => {
    const style = el.getAttribute('style') || ''
    if (style.includes('border-bottom') && style.includes('z-index: 10')) {
      el.style.setProperty('display', 'none', 'important')
    }
  })
}

export default function TranslateOffsetFix() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    const reset = () => {
      forceReset(html)
      forceReset(body)
      hideTranslateBanner()
    }

    // Run once immediately in case the offset was already applied before
    // this component mounted.
    reset()

    // Watch for Google re-adding its class or style at any point (translate
    // widget init can be asynchronous/delayed) and re-apply our override.
    // forceReset() is idempotent (skips already-correct properties), so
    // this converges instead of looping indefinitely.
    const observer = new MutationObserver(reset)
    observer.observe(html, { attributes: true, attributeFilter: ['style', 'class'] })
    observer.observe(body, { attributes: true, attributeFilter: ['style', 'class'] })

    return () => observer.disconnect()
  }, [])

  return null
}