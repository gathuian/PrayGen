import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Loader2, Sparkles, Check, Copy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { generatePrayer } from "@/src/lib/gemini";
import { db, auth } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrayerSection {
  heading: string;
  content: string;
}

interface PrayerResult {
  title: string;
  sections: PrayerSection[];
  fullPrayer: string;
}

export default function PrayerGenerator() {
  const [input, setInput] = useState("");
  const [type, setType] = useState("General");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrayerResult | null>(null);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setSaved(false);
    try {
      const prayer = await generatePrayer(input, type);
      setResult(prayer);
    } catch (error) {
      console.error("Prayer generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const saveToJournal = async () => {
    if (!result || !auth.currentUser) return;
    try {
      await addDoc(collection(db, "users", auth.currentUser.uid, "prayers"), {
        ...result,
        input,
        type,
        createdAt: serverTimestamp(),
        ownerId: auth.currentUser.uid
      });
      setSaved(true);
    } catch (error) {
      console.error("Failed to save prayer", error);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.fullPrayer);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-full glass-card border-none text-xs font-semibold uppercase tracking-wider h-12">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/10">
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Healing">Healing</SelectItem>
              <SelectItem value="Finances">Finances</SelectItem>
              <SelectItem value="Guidance">Guidance</SelectItem>
              <SelectItem value="For Others">For Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Textarea
            placeholder="Enter your situation (e.g., 'Guidance for a new job interview tomorrow')"
            className="min-h-[160px] rounded-3xl p-6 glass-card border-none focus-visible:ring-primary/40 resize-none text-lg placeholder:opacity-30"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            className="absolute bottom-4 right-4 rounded-full px-6 h-12 font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            disabled={loading || !input.trim()}
            onClick={handleGenerate}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Prayer <Send className="ml-2 w-4 h-4" /></>}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center gap-4"
          >
            <div className="relative">
              <Sparkles className="w-12 h-12 text-primary animate-pulse" />
              <motion.div 
                className="absolute inset-0 rounded-full bg-primary/20"
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
            <p className="text-muted-foreground font-heading italic text-xl tracking-wide">Seeking the Father's heart for you...</p>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-0 border-none glass-card rounded-[2rem] overflow-hidden">
              <div className="p-6 bg-white/5 border-b border-white/10 flex justify-between items-center px-8">
                <h3 className="font-heading text-2xl text-primary italic">{result.title}</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} className="rounded-full hover:bg-white/10">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={saved ? "secondary" : "ghost"} 
                    size="icon" 
                    onClick={saveToJournal} 
                    className="rounded-full hover:bg-white/10"
                    disabled={saved}
                  >
                    {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="h-[450px] p-8 pr-10">
                <div className="space-y-10">
                  {result.sections.map((section, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-3">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary/40 block" />
                         <h4 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold opacity-60">
                           {section.heading}
                         </h4>
                      </div>
                      <p className="text-xl font-heading leading-relaxed text-white/90 italic pl-4 border-l border-white/5">
                        {section.content}
                      </p>
                    </motion.div>
                  ))}
                  <div className="pt-8 text-center">
                    <p className="text-3xl font-heading font-bold text-primary italic">Amen.</p>
                  </div>
                </div>
              </ScrollArea>
            </Card>

            <div className="text-center pt-2">
               <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-40">Lord's Prayer Biblical Structure Applied</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
