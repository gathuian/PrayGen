import { useState, useEffect } from "react";
import { Search, Book, ChevronRight, Share2, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "Psalms", "Proverbs", "Isaiah", "Matthew", "John", "Romans"
];

export default function BibleModule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [verseOfDay, setVerseOfDay] = useState({ text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" });

  return (
    <div className="space-y-6 pb-4">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
        <Input 
          placeholder="Search scripture..." 
          className="pl-12 h-14 rounded-full glass-card border-none focus-visible:ring-primary/40 text-lg placeholder:opacity-30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="p-8 glass-card border-none rounded-[2rem] space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Book className="w-24 h-24 text-primary" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Daily Manna</span>
            <Bookmark className="w-4 h-4 text-primary opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
          </div>
          <p className="text-2xl font-heading leading-relaxed italic text-white/90">"{verseOfDay.text}"</p>
          <div className="flex justify-between items-center pt-2">
            <p className="text-xs uppercase tracking-widest font-bold text-primary">{verseOfDay.ref}</p>
            <Button variant="ghost" size="sm" className="rounded-full gap-2 hover:bg-white/10 opacity-60 hover:opacity-100">
              <Share2 className="w-3 h-3 text-primary" /> <span className="text-[10px] font-bold uppercase tracking-widest">Share</span>
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Browse Library</span>
            <div className="h-px flex-1 bg-primary/10" />
        </div>
        <div className="grid grid-cols-1 gap-2">
          {BOOKS.filter(b => b.toLowerCase().includes(searchTerm.toLowerCase())).map(book => (
            <Card key={book} className="p-5 flex justify-between items-center glass-card hover:bg-white/10 transition-all cursor-pointer border-none shadow-none rounded-2xl group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Book className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg font-heading italic">{book}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-primary opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
