import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/sendContactEmail";

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      await sendContactEmail(data);
      setIsSuccess(true);
      toast.success("Message received!", {
        description: "Thanks for reaching out — I'll get back to you soon.",
      });
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.error("Could not send message", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-start gap-3"
          >
            <MailCheck className="text-emerald-400 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-semibold text-emerald-300">We received your email!</p>
              <p className="text-xs text-emerald-400/80 mt-1">
                Thanks for reaching out. I'll read your message and get back to you soon.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2 ml-1">
            Name
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            {...register("name", { required: "Name is required" })}
            type="text"
            id="name"
            placeholder="John Doe"
            className={`w-full bg-secondary/30 backdrop-blur-md border ${errors.name ? "border-red-500/50" : "border-primary/20"} rounded-lg px-4 py-3 text-base sm:text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all duration-300`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2 ml-1">
            Email
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            id="email"
            placeholder="john@example.com"
            className={`w-full bg-secondary/30 backdrop-blur-md border ${errors.email ? "border-red-500/50" : "border-primary/20"} rounded-lg px-4 py-3 text-base sm:text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all duration-300`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2 ml-1">
            Message
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            {...register("message", { required: "Message is required" })}
            id="message"
            rows={4}
            placeholder="Tell me about your project..."
            className={`w-full bg-secondary/30 backdrop-blur-md border ${errors.message ? "border-red-500/50" : "border-primary/20"} rounded-lg px-4 py-3 text-base sm:text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all duration-300 resize-none`}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1 ml-1">{errors.message.message}</p>}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          type="submit"
          className={`w-full flex items-center justify-center gap-2 py-3.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 min-h-[48px] ${
            isSuccess
              ? "bg-green-500/20 text-green-400 border border-green-500/50"
              : "bg-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
          }`}
        >
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 className="animate-spin" size={20} />
              </motion.div>
            ) : isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-2"
              >
                <CheckCircle size={20} />
                <span>Sent!</span>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Send size={18} />
                <span>Send Message</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </div>
  );
}
