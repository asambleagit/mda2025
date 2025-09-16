 // FAQ Toggle
        function toggleFAQ(element) {
            const faqItem = element.parentElement;
            const isActive = faqItem.classList.contains("active");

            // Close all FAQ items
            document.querySelectorAll(".faq-item").forEach((item) => {
                item.classList.remove("active");
                item.querySelector(".fa-chevron-down").style.transform =
                    "rotate(0deg)";
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add("active");
                element.querySelector(".fa-chevron-down").style.transform =
                    "rotate(180deg)";
            }
        }