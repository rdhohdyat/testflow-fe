import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Send, Mail, MessageSquare } from "lucide-react";

const Contact = () => {
  return (
    <section
      id="contact"
      className="px-8 py-20 bg-white dark:bg-neutral-950 overflow-hidden font-sans"
    >
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase mb-4 block">
            Hubungan Terbuka
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter">
            Mari <span className="italic text-emerald-500">Berdiskusi</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-400 font-medium max-w-xl mx-auto leading-relaxed">
            Punya pertanyaan teknis atau sekadar ingin menyapa? Hubungi kami.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            className="lg:col-span-12 max-w-2xl mx-auto w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-none bg-neutral-50 dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl shadow-neutral-100 dark:shadow-none overflow-hidden">
              <CardHeader className="p-8 pb-4 border-b border-neutral-50 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <CardTitle className="text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-4 tracking-tighter">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  Kirim Pesan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form
                  action="https://formspree.io/f/mreawbre"
                  method="POST"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400">
                      NAMA LENGKAP
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name" // WAJIB ADA
                      placeholder="Masukkan nama Anda"
                      className="h-14 rounded-xl border-none bg-white dark:bg-neutral-800 shadow-sm dark:shadow-none focus-visible:ring-emerald-500 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400">
                      ALAMAT EMAIL
                    </Label>
                    <div className="relative">
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="nama@mail.com"
                        className="h-14 pl-12 rounded-xl border-none bg-white dark:bg-neutral-800 shadow-sm dark:shadow-none focus-visible:ring-emerald-500 dark:text-white"
                        required
                      />
                      <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                    </div>
                  </div>

                  {/* Field Pesan */}
                  <div className="md:col-span-2 space-y-3">
                    <Label htmlFor="message" className="text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400">
                      PESAN ANDA
                    </Label>
                    <Textarea
                      id="message"
                      name="message" // WAJIB ADA
                      placeholder="Bagaimana kami bisa membantu?"
                      className="min-h-[140px] rounded-2xl border-none bg-white dark:bg-neutral-800 shadow-sm dark:shadow-none focus-visible:ring-emerald-500 font-bold p-5 dark:text-white"
                      required
                    />
                  </div>

                  {/* Tombol Kirim */}
                  <div className="md:col-span-2 pt-2">
                    <Button
                      type="submit"
                      className="w-full h-16 rounded-2xl bg-neutral-900 dark:bg-emerald-600 text-white hover:bg-neutral-800 dark:hover:bg-emerald-700 text-base font-black tracking-tighter shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                    >
                      KIRIM PESAN SEKARANG
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;