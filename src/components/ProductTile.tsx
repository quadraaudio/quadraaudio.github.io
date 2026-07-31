import Link from "next/link";
import styles from "./ProductTile.module.scss";

interface ProductTileProps {
  eyebrow: string;
  headline: string;
  image: string;
  learnMoreHref: string;
  buyHref?: string;
}

export default function ProductTile({
  eyebrow,
  headline,
  image,
  learnMoreHref,
  buyHref,
}: ProductTileProps) {
  return (
    <div className={styles.tile} style={{ backgroundImage: `url(${image})` }}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h3 className={styles.headline}>{headline}</h3>
        <div className={styles.links}>
          <Link href={learnMoreHref} className={styles.link}>
            Learn more &gt;
          </Link>
          {buyHref && (
            <Link href={buyHref} className={styles.link}>
              Buy &gt;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
