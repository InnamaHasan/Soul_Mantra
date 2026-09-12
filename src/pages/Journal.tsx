import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { journalService } from '../services/mockApi';
import { JournalEntry, Mood } from '../types';
import { Search, Plus, Trash2, Edit2, Calendar, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [search, setSearch] = useState('');
  const [moodFilter, setMoodFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({ title: '', content: '', moodTag: '' as Mood | '' });
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const data = await journalService.getEntries();
    setEntries(data);
  };

  const handleSave = async () => {
    if (!currentEntry.title || !currentEntry.content) {
      toast({ title: 'Error', description: 'Title and content are required', variant: 'destructive' });
      return;
    }
    
    await journalService.saveEntry({
      title: currentEntry.title,
      content: currentEntry.content,
      date: new Date().toISOString(),
      moodTag: currentEntry.moodTag ? (currentEntry.moodTag as Mood) : null,
      wordCount: currentEntry.content.trim().split(/\s+/).length
    });
    
    toast({ title: 'Success', description: 'Journal entry saved' });
    setIsCreating(false);
    setCurrentEntry({ title: '', content: '', moodTag: '' });
    loadEntries();
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this entry?')) {
      await journalService.deleteEntry(id);
      toast({ title: 'Deleted', description: 'Entry removed successfully' });
      loadEntries();
    }
  };

  const filteredEntries = entries.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase());
    const matchesMood = moodFilter === 'all' || e.moodTag === moodFilter;
    return matchesSearch && matchesMood;
  });

  if (isCreating) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">New Entry</h2>
          <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Input 
              placeholder="Entry Title" 
              className="text-lg font-medium"
              value={currentEntry.title}
              onChange={e => setCurrentEntry({...currentEntry, title: e.target.value})}
            />
            <Textarea 
              placeholder="What's on your mind today?" 
              className="min-h-[400px] text-base resize-none"
              value={currentEntry.content}
              onChange={e => setCurrentEntry({...currentEntry, content: e.target.value})}
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{currentEntry.content.trim() ? currentEntry.content.trim().split(/\s+/).length : 0} words</span>
              <Button onClick={handleSave}>Save Entry</Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tag Mood</label>
                  <Select value={currentEntry.moodTag} onValueChange={(v) => setCurrentEntry({...currentEntry, moodTag: v as Mood})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="happy">Happy</SelectItem>
                      <SelectItem value="calm">Calm</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="sad">Sad</SelectItem>
                      <SelectItem value="anxious">Anxious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-primary flex items-center mb-2">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Writing Prompt
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    "What is one thing that brought you a sense of peace today, no matter how small?"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
          <p className="text-muted-foreground">Reflect on your thoughts and feelings.</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Entry
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search entries..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={moodFilter} onValueChange={setMoodFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Moods</SelectItem>
            <SelectItem value="happy">Happy</SelectItem>
            <SelectItem value="calm">Calm</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="sad">Sad</SelectItem>
            <SelectItem value="anxious">Anxious</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map(entry => (
          <Card key={entry.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-1">{entry.title}</CardTitle>
                {entry.moodTag && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                    {entry.moodTag}
                  </span>
                )}
              </div>
              <CardDescription className="flex items-center text-xs">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(entry.date).toLocaleDateString()} • {entry.wordCount} words
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-4">
                {entry.content}
              </p>
            </CardContent>
            <CardFooter className="pt-3 border-t flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs">Read More</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{entry.title}</DialogTitle>
                    <DialogDescription>
                      {new Date(entry.date).toLocaleDateString()} • {entry.moodTag}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </div>
                  <div className="mt-6 p-4 bg-muted rounded-lg border border-dashed border-primary/30 relative">
                    <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-semibold text-primary flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" /> AI Reflection (Coming Soon)
                    </div>
                    <p className="text-sm text-muted-foreground italic text-center">
                      Backend AI integration required to generate deeper insights into this entry.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm" className="text-xs text-destructive hover:bg-destructive/10" onClick={() => handleDelete(entry.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        {filteredEntries.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No entries found.
          </div>
        )}
      </div>
    </div>
  );
}
