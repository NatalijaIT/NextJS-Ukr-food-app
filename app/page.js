import Link from "next/link";
import classes from "./page.module.css";
import ImageSlideshow from "@/components/images/image-slideshow";

export default function Home() {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.slideshow}>
          <ImageSlideshow />
        </div>
        <div>
          <div className={classes.hero}>
            <h1>Ukrainian food</h1>
            <p>Taste and share food from all over the world.</p>
          </div>
          <div className={classes.cta}>
            <Link href="/meals">Explore Meals</Link>
          </div>
        </div>
      </header>
      <main>
        <section className={classes.section}>
          <h2>How it works</h2>
          <p>
            Ukrainian Food is a platform to share their favorite
            recipes with the world. It&apos;s a place to discover Ukrainian dishes, and to
            connect with other food lovers.
          </p>
          <p>
            Ukrainian Food is a place to discover dishes, and to connect
            with other food lovers.
          </p>
        </section>

        <section className={classes.section}>
          <h2>Why Ukrainian Food?</h2>
          <p>
            Ukrainian Food is a platform to share their favorite
            recipes with the world. It&apos;s a place to discover dishes, and to
            connect with other food lovers.
          </p>
          <p>
            Ukrainian Food is a place to discover dishes, and to connect
            with other food lovers.
          </p>
        </section>
      </main>
    </>
  );
}
