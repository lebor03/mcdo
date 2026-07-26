"use client";

import { useEffect, useRef, useState } from "react";

type Screen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export default function Home() {
  const [screen, setScreen] = useState<Screen>(1);
  const [drag, setDrag] = useState(0);
  const [usedAt, setUsedAt] = useState<Date | null>(null);
  const dragStart = useRef<number | null>(null);
  const dragDistance = useRef(0);
  const dragLimit = useRef(0);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  function completeSwipe() {
    setUsedAt(new Date());
    setScreen(8);
    setDrag(0);
  }

  function startSwipe(clientX: number, trackWidth: number) {
    if (screen !== 7) return;
    dragStart.current = clientX;
    dragDistance.current = 0;
    dragLimit.current = Math.max(120, trackWidth * 0.64);
    setDrag(0);
  }

  function moveSwipe(clientX: number) {
    if (screen !== 7 || dragStart.current === null) return;
    const nextDrag = Math.max(
      0,
      Math.min(dragLimit.current, clientX - dragStart.current),
    );
    dragDistance.current = nextDrag;
    setDrag(nextDrag);
  }

  function endSwipe(clientX?: number) {
    if (screen !== 7 || dragStart.current === null) return;
    const releasedDistance =
      typeof clientX === "number"
        ? Math.max(dragDistance.current, clientX - dragStart.current)
        : dragDistance.current;

    if (releasedDistance >= dragLimit.current * 0.55) {
      setDrag(dragLimit.current);
      window.setTimeout(() => {
        completeSwipe();
      }, 180);
    } else {
      setDrag(0);
    }
    dragStart.current = null;
    dragDistance.current = 0;
  }

  return (
    <main className="app-stage">
      <section
        className="phone"
        aria-label={`Easy at Work — écran ${screen} sur 8`}
        onClick={() => {
          if (screen === 1) setScreen(2);
          if (screen === 3) setScreen(4);
        }}
      >
        <img
          className="screen-image"
          src={`/screens/${screen}.jpg`}
          alt=""
          draggable={false}
        />

        {screen === 2 && (
          <button
            className="hotspot continue-hotspot"
            aria-label="Continuer"
            onClick={(event) => {
              event.stopPropagation();
              setScreen(3);
            }}
          />
        )}

        {screen === 4 && (
          <button
            className="hotspot menu-hotspot"
            aria-label="Ouvrir le menu"
            onClick={(event) => {
              event.stopPropagation();
              setScreen(5);
            }}
          />
        )}

        {screen === 5 && (
          <>
            <button
              className="hotspot close-menu-hotspot"
              aria-label="Fermer le menu"
              onClick={(event) => {
                event.stopPropagation();
                setScreen(4);
              }}
            />
            <button
              className="hotspot coupons-hotspot"
              aria-label="Coupons"
              onClick={(event) => {
                event.stopPropagation();
                setScreen(6);
              }}
            />
          </>
        )}

        {screen === 6 && (
          <>
            <button
              className="hotspot menu-hotspot"
              aria-label="Ouvrir le menu"
              onClick={(event) => {
                event.stopPropagation();
                setScreen(5);
              }}
            />
            <button
              className="hotspot first-coupon-hotspot"
              aria-label="Ouvrir le premier coupon"
              onClick={(event) => {
                event.stopPropagation();
                setScreen(7);
              }}
            />
          </>
        )}

        {screen === 7 && (
          <>
            <button
              className="hotspot close-coupon-hotspot"
              aria-label="Fermer le coupon"
              onClick={(event) => {
                event.stopPropagation();
                setScreen(6);
              }}
            />
            <div
              className="swipe-hotspot"
              role="slider"
              aria-label="Glisser pour utiliser le coupon"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((drag / 230) * 100)}
              tabIndex={0}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                startSwipe(
                  event.clientX,
                  event.currentTarget.getBoundingClientRect().width,
                );
              }}
              onPointerMove={(event) => moveSwipe(event.clientX)}
              onPointerUp={(event) => endSwipe(event.clientX)}
              onPointerCancel={() => endSwipe()}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "Enter") {
                  completeSwipe();
                }
              }}
            >
              <span
                className="swipe-thumb"
                style={{ transform: `translateX(${drag}px)` }}
              />
            </div>
          </>
        )}

        {screen === 8 && (
          <>
            <p className="used-at" aria-live="polite">
              Utilisé le{" "}
              {usedAt?.toLocaleDateString("fr-CH", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              {usedAt?.toLocaleTimeString("fr-CH", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button
              className="hotspot close-used-hotspot"
              aria-label="Fermer le coupon utilisé"
              onClick={(event) => {
                event.stopPropagation();
                setScreen(6);
              }}
            />
          </>
        )}

        <button
          className="restart"
          aria-label="Recommencer la démonstration"
          onClick={(event) => {
            event.stopPropagation();
            setScreen(1);
          }}
        >
          Recommencer
        </button>
      </section>
    </main>
  );
}
