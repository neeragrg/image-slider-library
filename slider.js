
(() => {
    "use strict";

    class ImageSlider {
        constructor(root) {
            this.root = root;
            this.track = root.querySelector("[data-track]");
            this.slides = Array.from(
                this.track.querySelectorAll(".slide")
            );

            this.previousButton = root.querySelector("[data-previous]");
            this.nextButton = root.querySelector("[data-next]");
            this.dotsContainer = root.querySelector("[data-dots]");
            this.status = root.querySelector("[data-status]");

            this.index = 0;
            this.slideCount = this.slides.length;

            if (
                !this.slideCount ||
                !this.previousButton ||
                !this.nextButton ||
                !this.dotsContainer
            ) {
                return;
            }

            this.createDots();
            this.bindEvents();
            this.render();
        }

        createDots() {
            const fragment = document.createDocumentFragment();

            this.slides.forEach((slide, index) => {
                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "slider__dot";
                dot.setAttribute(
                    "aria-label",
                    `Go to slide ${index + 1}`
                );

                dot.addEventListener("click", () => {
                    this.goTo(index);
                });

                fragment.appendChild(dot);
            });

            this.dotsContainer.replaceChildren(fragment);

            this.dots = Array.from(
                this.dotsContainer.querySelectorAll("button")
            );
        }

        bindEvents() {
            this.nextButton.addEventListener("click", () => {
                this.goTo(this.index + 1);
            });

            this.previousButton.addEventListener("click", () => {
                this.goTo(this.index - 1);
            });

            this.root.addEventListener("keydown", (event) => {
                if (event.key === "ArrowRight") {
                    this.goTo(this.index + 1);
                }

                if (event.key === "ArrowLeft") {
                    this.goTo(this.index - 1);
                }
            });
        }

        goTo(requestedIndex) {
            // Wrap the index at both boundaries.
            this.index =
                (requestedIndex + this.slideCount) % this.slideCount;

            this.render();
        }

        render() {
            // Move the horizontal track to the active slide.
            this.track.style.transform =
                `translateX(-${this.index * 100}%)`;

            // Update the active indicator.
            this.dots.forEach((dot, dotIndex) => {
                const isCurrent = dotIndex === this.index;

                dot.setAttribute(
                    "aria-current",
                    String(isCurrent)
                );

                dot.tabIndex = isCurrent ? 0 : -1;
            });

            // Update the accessible slide counter.
            if (this.status) {
                this.status.textContent =
                    `Slide ${this.index + 1} of ${this.slideCount}`;
            }
        }
    }

    // Initialize every slider on the page.
    document.querySelectorAll("[data-slider]").forEach((slider) => {
        new ImageSlider(slider);
    });
})();
