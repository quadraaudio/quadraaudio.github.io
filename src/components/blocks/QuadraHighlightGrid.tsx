"use client";

import styles from "./quadra.module.scss";

export interface GridTile {
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl?: string;
  link?: string;
}

export interface QuadraHighlightGridProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  tiles?: GridTile[];
}

const DEFAULT_TILES: GridTile[] = [
  {
    title: "Hydra",
    subtitle: "Virtual soundcard, AoIP matrix, and spatial monitor control for macOS.",
    badge: "Product",
    imageUrl: "/images/hydra_app_icon.jpg",
    link: "/hydra",
  },
  {
    title: "Store",
    subtitle: "Licenses, downloads, and perpetual ownership.",
    badge: "Shop",
    imageUrl: "/images/store_hydra_card.jpg",
    link: "/store",
  },
  {
    title: "Support",
    subtitle: "Setup guides and network audio documentation.",
    badge: "Help",
    imageUrl: "/images/home_support_grid.jpg",
    link: "/support",
  },
];

export function QuadraHighlightGrid({
  sectionTitle,
  sectionSubtitle,
  tiles = DEFAULT_TILES,
}: QuadraHighlightGridProps) {
  return (
    <section className={styles.grid}>
      {(sectionTitle || sectionSubtitle) && (
        <header className={styles.gridHeader}>
          {sectionTitle ? <h2 className={styles.gridTitle}>{sectionTitle}</h2> : null}
          {sectionSubtitle ? (
            <p className={styles.gridSubtitle}>{sectionSubtitle}</p>
          ) : null}
        </header>
      )}
      <div className={styles.gridTiles}>
        {tiles.map((tile) => (
          <a
            key={`${tile.title}-${tile.link}`}
            className={styles.tile}
            href={tile.link || "#"}
          >
            {tile.imageUrl ? (
              <div className={styles.tileMedia}>
                <img src={tile.imageUrl} alt="" />
              </div>
            ) : null}
            <div className={styles.tileShade} />
            <div className={styles.tileCopy}>
              {tile.badge ? <span className={styles.tileBadge}>{tile.badge}</span> : null}
              <h3 className={styles.tileTitle}>{tile.title}</h3>
              <p className={styles.tileSubtitle}>{tile.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
