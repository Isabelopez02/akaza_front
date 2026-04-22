"use client";

import { useMemo } from "react";

import styles from "./cocina.module.css";
import { OrderStatus } from "../types/orders";
import { useOrdersWebSocket } from "../hooks/useOrdersWebSocket";
import OrderCard from "../components/OrderCar";

const COLUMNS: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "pending",   label: "Pendientes",      icon: "⏳" },
  { key: "preparing", label: "En preparación",  icon: "🔥" },
  { key: "ready",     label: "Listos",          icon: "✅" },
];

export default function CocinaPage() {
  const { orders, status, updateOrderStatus } = useOrdersWebSocket();

  const grouped = useMemo(() => {
    const map: Record<OrderStatus, typeof orders> = {
      pending: [],
      preparing: [],
      ready: [],
    };
    orders.forEach((o) => map[o.status].push(o));
    return map;
  }, [orders]);

  const totalActive = grouped.pending.length + grouped.preparing.length;

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>👨‍🍳</span>
          <div>
            <h1 className={styles.title}>Panel de Cocina</h1>
            <p className={styles.subtitle}>Akaza · Vista del Chef</p>
          </div>
        </div>

        <div className={styles.headerRight}>
          {totalActive > 0 && (
            <span className={styles.activeBadge}>{totalActive} activos</span>
          )}
          <div className={`${styles.wsStatus} ${styles[`ws_${status}`]}`}>
            <span className={styles.wsDot} />
            <span className={styles.wsLabel}>
              {status === "connected" && "En vivo"}
              {status === "connecting" && "Conectando..."}
              {status === "disconnected" && "Reconectando..."}
              {status === "error" && "Sin conexión"}
            </span>
          </div>
        </div>
      </header>

      {/* Kanban board */}
      <main className={styles.board}>
        {COLUMNS.map((col) => (
          <section key={col.key} className={styles.column}>
            <div className={styles.colHeader}>
              <span className={styles.colIcon}>{col.icon}</span>
              <span className={styles.colLabel}>{col.label}</span>
              <span className={styles.colCount}>{grouped[col.key].length}</span>
            </div>

            <div className={styles.cardList}>
              {grouped[col.key].length === 0 ? (
                <div className={styles.empty}>
                  {col.key === "pending" ? "Sin pedidos nuevos" : "Vacío"}
                </div>
              ) : (
                grouped[col.key].map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={updateOrderStatus}
                  />
                ))
              )}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
