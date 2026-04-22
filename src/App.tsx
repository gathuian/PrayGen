/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  BookOpen, 
  Image as ImageIcon, 
  MessageSquare, 
  User, 
  Home as HomeIcon,
  Sun,
  Moon,
  Sparkles
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth, db } from "@/src/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Import components
import PrayerGenerator from "./components/PrayerGenerator";
import BibleModule from "./components/BibleModule";
// import WallpaperCreator from "./components/WallpaperCreator";
// import ProfilePage from "./components/ProfilePage";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Initialize user doc if not exists
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, "users", currentUser.uid), {
            displayName: currentUser.displayName,
            email: currentUser.email,
            language: "en",
            experienceLevel: "beginner",
            createdAt: new Date(),
          });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sparkles className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 text-center space-y-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Sparkles className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-heading text-primary">PrayGen AI</h1>
          <p className="text-muted-foreground max-w-sm font-sans">
            "Learn to Pray. Grow in Faith. One Prayer at a Time."
          </p>
        </motion.div>

        <Button onClick={handleLogin} size="lg" className="rounded-full px-8">
          Continue with Google
        </Button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] border-x border-white/5">
        {/* Header */}
        <header className="p-4 flex justify-between items-center bg-transparent backdrop-blur-xl sticky top-0 z-50 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-heading text-xl font-bold tracking-tight text-primary">PrayGen</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
              <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Profile" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 px-4">
          <Tabs defaultValue="home" className="w-full">
            <TabsContent value="home" className="mt-0 outline-none">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="py-6 space-y-8"
              >
                <section className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold opacity-80">Daily Inspiration</span>
                    <h2 className="text-3xl font-heading leading-tight italic">Welcome, {user.displayName?.split(" ")[0]}</h2>
                  </div>
                  <Card className="p-8 glass-card border-none rounded-[2rem]">
                    <p className="italic text-xl font-heading leading-relaxed opacity-90">
                      "Your word is a lamp to my feet and a light to my path."
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">— Psalm 119:105</p>
                  </Card>
                </section>

                <div className="grid grid-cols-2 gap-4">
                   <Card className="p-6 glass-card border-none rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-colors cursor-pointer group">
                     <ImageIcon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                     <span className="text-xs uppercase tracking-widest font-bold opacity-60">Wallpapers</span>
                   </Card>
                   <Card className="p-6 glass-card border-none rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-colors cursor-pointer group">
                     <BookOpen className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                     <span className="text-xs uppercase tracking-widest font-bold opacity-60">Sermons</span>
                   </Card>
                </div>

                <section className="space-y-4 text-center py-6">
                  <p className="font-heading text-xl text-primary italic opacity-80">How shall we pray today?</p>
                </section>
              </motion.div>
            </TabsContent>

            <TabsContent value="pray" className="mt-0 outline-none">
              <div className="py-6">
                <div className="mb-8 space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold opacity-80">AI Spiritual Companion</span>
                  <h2 className="text-3xl font-heading">Prayer Generator</h2>
                </div>
                <PrayerGenerator />
              </div>
            </TabsContent>

            <TabsContent value="bible" className="mt-0 outline-none">
              <div className="py-6">
                <div className="mb-8 space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold opacity-80">Scripture Study</span>
                  <h2 className="text-3xl font-heading">Holy Bible</h2>
                </div>
                <BibleModule />
              </div>
            </TabsContent>

            <TabsContent value="profile" className="mt-0 outline-none">
              <div className="py-10 flex flex-col items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full glass-card flex items-center justify-center p-1 border-primary/20">
                    <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-background" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                   <h2 className="text-3xl font-heading italic">{user.displayName}</h2>
                   <p className="text-xs uppercase tracking-widest opacity-50">{user.email}</p>
                </div>
                
                <div className="w-full space-y-3">
                   <div className="p-5 rounded-2xl glass-card flex justify-between items-center border-none">
                     <span className="text-xs uppercase tracking-widest font-bold opacity-60">Language</span>
                     <span className="font-medium text-primary">English</span>
                   </div>
                   <div className="p-5 rounded-2xl glass-card flex justify-between items-center border-none">
                     <span className="text-xs uppercase tracking-widest font-bold opacity-60">Experience</span>
                     <span className="font-medium text-primary">Beginner</span>
                   </div>
                </div>

                <Button variant="ghost" className="w-full rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 mt-4" onClick={() => auth.signOut()}>
                  Sign Out
                </Button>
              </div>
            </TabsContent>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/60 backdrop-blur-2xl border-t border-white/10 px-6 py-4 pb-10 max-w-md mx-auto z-50">
              <TabsList className="grid grid-cols-4 bg-transparent h-auto p-0 gap-2">
                <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:shadow-[0_0_15px_rgba(212,175,55,0.3)] flex flex-col gap-1.5 py-3 rounded-2xl transition-all duration-300 group">
                  <HomeIcon className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Home</span>
                </TabsTrigger>
                <TabsTrigger value="pray" className="data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:shadow-[0_0_15px_rgba(212,175,55,0.3)] flex flex-col gap-1.5 py-3 rounded-2xl transition-all duration-300 group">
                  <Heart className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Pray</span>
                </TabsTrigger>
                <TabsTrigger value="bible" className="data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:shadow-[0_0_15px_rgba(212,175,55,0.3)] flex flex-col gap-1.5 py-3 rounded-2xl transition-all duration-300 group">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Bible</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:shadow-[0_0_15px_rgba(212,175,55,0.3)] flex flex-col gap-1.5 py-3 rounded-2xl transition-all duration-300 group">
                  <User className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">User</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

