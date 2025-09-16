import { HttpClient } from "@angular/common/http";
import { Component, inject, signal, effect, DestroyRef } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  http = inject(HttpClient);
  destroyRef = inject(DestroyRef);
  fb = inject(FormBuilder);
  private toast = inject(ToastrService);

  constructor() {
    // Effect to handle body scroll locking
    effect(() => {
      if (this.isMobileMenuOpen()) {
        document.body.classList.add("menu-open");
      } else {
        document.body.classList.remove("menu-open");
      }
    });

    // Cleanup on component destroy
    this.destroyRef.onDestroy(() => {
      document.body.classList.remove("menu-open");
    });
  }

  // Mobile menu state
  isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((value) => !value);
  }

  // Course carousel methods
  scrollLeft() {
    const container = document.querySelector(".course-scroll-container");
    if (container) {
      container.scrollBy({ left: -320, behavior: "smooth" });
    }
  }

  scrollRight() {
    const container = document.querySelector(".course-scroll-container");
    if (container) {
      container.scrollBy({ left: 320, behavior: "smooth" });
    }
  }

  redirectToWhatsApp() {
    window.open(
      "https://api.whatsapp.com/send?phone=905340798944&text=Merhaba%20bilgi%20alabilir%20miyim%20%3F",
      "_blank"
    );
  }

  contactForm = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    phoneNumber: ["", [Validators.required]],
  });

  onSubmit() {
    this.http
      .post("https://formspree.io/f/xnnpbogo", this.contactForm.value)
      .subscribe({
        next: (res) => {
          this.toast.success("Form başarıyla gönderildi!", "Başarılı");
          this.contactForm.reset();
        },
        error: (error) => {
          this.toast.error(
            "Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
            "Hata"
          );
          console.error("Form submission error:", error);
        },
      });
  }
}
