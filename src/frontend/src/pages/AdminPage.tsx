import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  EyeOff,
  Film,
  Loader2,
  Lock,
  LogOut,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { DownloadUrl, Movie, backendInterface } from "../backend.d";
import { useActor } from "../hooks/useActor";

const ADMIN_PIN = "mahidhar123";
const SESSION_KEY = "adminAuth";

interface MovieForm {
  title: string;
  year: string;
  genre: string;
  language: string;
  synopsis: string;
  thumbnailUrl: string;
  videoUrl: string;
  downloadUrls: { id: number; quality: string; url: string }[];
  featured: boolean;
}

const emptyForm: MovieForm = {
  title: "",
  year: "",
  genre: "",
  language: "",
  synopsis: "",
  thumbnailUrl: "",
  videoUrl: "",
  downloadUrls: [{ id: 1, quality: "720p", url: "" }],
  featured: false,
};

function movieToForm(m: Movie): MovieForm {
  return {
    title: m.title,
    year: m.year.toString(),
    genre: m.genre,
    language: m.language,
    synopsis: m.synopsis,
    thumbnailUrl: m.thumbnailUrl,
    videoUrl: m.videoUrl,
    downloadUrls:
      m.downloadUrls.length > 0
        ? m.downloadUrls.map((d, i) => ({
            id: i + 1,
            quality: d.quality,
            url: d.url,
          }))
        : [{ id: 1, quality: "720p", url: "" }],
    featured: m.featured,
  };
}

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(SESSION_KEY, "true");
      onUnlock();
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Admin Access
          </h1>
          <p className="text-zinc-400 text-sm mt-1 text-center">
            Enter your PIN to manage CinemaVault
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              data-ocid="admin.input"
              type={showPin ? "text" : "password"}
              placeholder="Enter admin PIN"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-14 text-lg pr-12 rounded-xl"
              autoComplete="off"
              autoFocus
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              onClick={() => setShowPin((v) => !v)}
            >
              {showPin ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {error && (
            <p
              data-ocid="admin.error_state"
              className="text-red-400 text-sm text-center"
            >
              {error}
            </p>
          )}
          <Button
            data-ocid="admin.submit_button"
            type="submit"
            className="w-full h-14 text-lg bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl"
          >
            Unlock Admin Panel
          </Button>
        </form>
      </div>
    </div>
  );
}

function MovieFormDialog({
  open,
  onClose,
  initialData,
  editId,
  onSaved,
  actor,
}: {
  open: boolean;
  onClose: () => void;
  initialData: MovieForm;
  editId: bigint | null;
  onSaved: () => void;
  actor: backendInterface | null;
}) {
  const [form, setForm] = useState<MovieForm>(initialData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initialData);
  }, [open, initialData]);

  const setField = (
    field: keyof MovieForm,
    value: MovieForm[keyof MovieForm],
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const setDownload = (idx: number, key: "quality" | "url", val: string) =>
    setForm((prev) => {
      const arr = [...prev.downloadUrls];
      arr[idx] = { ...arr[idx], [key]: val };
      return { ...prev, downloadUrls: arr };
    });

  const addDownload = () =>
    setForm((prev) => ({
      ...prev,
      downloadUrls: [
        ...prev.downloadUrls,
        { id: Date.now(), quality: "", url: "" },
      ],
    }));

  const removeDownload = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      downloadUrls: prev.downloadUrls.filter((_, i) => i !== idx),
    }));

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!actor) {
      toast.error("Not connected to backend");
      return;
    }
    setSaving(true);
    try {
      const downloads: DownloadUrl[] = form.downloadUrls
        .filter((d) => d.url.trim())
        .map((d) => ({ quality: d.quality || "HD", url: d.url }));
      await actor.addOrUpdateMovie(
        editId ?? BigInt(0),
        form.title,
        BigInt(Number(form.year) || 2024),
        form.genre,
        form.language,
        form.synopsis,
        form.thumbnailUrl,
        form.videoUrl,
        downloads,
        form.featured,
      );
      toast.success(editId ? "Movie updated!" : "Movie added!");
      onSaved();
      onClose();
    } catch (err) {
      toast.error("Failed to save movie");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="admin.dialog"
        className="bg-zinc-900 border-zinc-700 text-white max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-amber-400 text-xl">
            {editId ? "Edit Movie" : "Add New Movie"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-zinc-300 text-sm mb-1 block">Title *</Label>
            <Input
              data-ocid="admin.input"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="Movie title"
              className="bg-zinc-800 border-zinc-700 text-white h-11"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-zinc-300 text-sm mb-1 block">Year</Label>
              <Input
                data-ocid="admin.input"
                type="number"
                value={form.year}
                onChange={(e) => setField("year", e.target.value)}
                placeholder="2024"
                className="bg-zinc-800 border-zinc-700 text-white h-11"
              />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm mb-1 block">
                Language
              </Label>
              <Input
                data-ocid="admin.input"
                value={form.language}
                onChange={(e) => setField("language", e.target.value)}
                placeholder="Telugu, Hindi"
                className="bg-zinc-800 border-zinc-700 text-white h-11"
              />
            </div>
          </div>
          <div>
            <Label className="text-zinc-300 text-sm mb-1 block">Genre</Label>
            <Input
              data-ocid="admin.input"
              value={form.genre}
              onChange={(e) => setField("genre", e.target.value)}
              placeholder="Action, Drama"
              className="bg-zinc-800 border-zinc-700 text-white h-11"
            />
          </div>
          <div>
            <Label className="text-zinc-300 text-sm mb-1 block">Synopsis</Label>
            <Textarea
              data-ocid="admin.textarea"
              value={form.synopsis}
              onChange={(e) => setField("synopsis", e.target.value)}
              placeholder="Brief description"
              className="bg-zinc-800 border-zinc-700 text-white resize-none"
              rows={3}
            />
          </div>
          <div>
            <Label className="text-zinc-300 text-sm mb-1 block">
              Thumbnail URL
            </Label>
            <Input
              data-ocid="admin.input"
              value={form.thumbnailUrl}
              onChange={(e) => setField("thumbnailUrl", e.target.value)}
              placeholder="https://"
              className="bg-zinc-800 border-zinc-700 text-white h-11"
            />
          </div>
          <div>
            <Label className="text-zinc-300 text-sm mb-1 block">
              Video URL
            </Label>
            <Input
              data-ocid="admin.input"
              value={form.videoUrl}
              onChange={(e) => setField("videoUrl", e.target.value)}
              placeholder="https://"
              className="bg-zinc-800 border-zinc-700 text-white h-11"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-zinc-300 text-sm">Download URLs</Label>
              <Button
                data-ocid="admin.secondary_button"
                type="button"
                variant="outline"
                size="sm"
                onClick={addDownload}
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 h-8 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" /> Add URL
              </Button>
            </div>
            <div className="space-y-2">
              {form.downloadUrls.map((d, idx) => (
                <div key={d.id} className="flex gap-2 items-center">
                  <Input
                    value={d.quality}
                    onChange={(e) =>
                      setDownload(idx, "quality", e.target.value)
                    }
                    placeholder="720p"
                    className="bg-zinc-800 border-zinc-700 text-white h-10 w-24 flex-shrink-0 text-sm"
                  />
                  <Input
                    value={d.url}
                    onChange={(e) => setDownload(idx, "url", e.target.value)}
                    placeholder="Download link"
                    className="bg-zinc-800 border-zinc-700 text-white h-10 flex-1 text-sm"
                  />
                  {form.downloadUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDownload(idx)}
                      className="text-zinc-500 hover:text-red-400 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Checkbox
              data-ocid="admin.checkbox"
              id="featured"
              checked={form.featured}
              onCheckedChange={(v) => setField("featured", Boolean(v))}
              className="border-zinc-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
            />
            <Label htmlFor="featured" className="text-zinc-300 cursor-pointer">
              Mark as Featured
            </Label>
          </div>
        </div>
        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button
            data-ocid="admin.cancel_button"
            variant="outline"
            onClick={onClose}
            className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            data-ocid="admin.save_button"
            onClick={handleSave}
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold w-full sm:w-auto"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {saving ? "Saving..." : "Save Movie"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { actor } = useActor();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<MovieForm>(emptyForm);
  const [editId, setEditId] = useState<bigint | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Movie | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMovies = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const all = await actor.getAllMovies();
      setMovies(all.sort((a, b) => Number(b.addedAt - a.addedAt)));
    } catch {
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const openAdd = () => {
    setEditId(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (m: Movie) => {
    setEditId(m.id);
    setFormData(movieToForm(m));
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !actor) return;
    setDeleting(true);
    try {
      await actor.removeMovie(deleteTarget.id);
      toast.success(`"${deleteTarget.title}" removed`);
      setDeleteTarget(null);
      await fetchMovies();
    } catch {
      toast.error("Failed to delete movie");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-amber-400" />
            <div>
              <h1 className="text-white font-bold text-lg leading-none">
                CinemaVault
              </h1>
              <span className="text-amber-400 text-xs">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              data-ocid="admin.primary_button"
              onClick={openAdd}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold h-9 px-4 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Movie
            </Button>
            <Button
              data-ocid="admin.secondary_button"
              variant="ghost"
              onClick={onLogout}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-9 px-3"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div
            data-ocid="admin.loading_state"
            className="flex justify-center py-20"
          >
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          </div>
        ) : movies.length === 0 ? (
          <div data-ocid="admin.empty_state" className="text-center py-20">
            <Film className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No movies yet</p>
            <p className="text-zinc-600 text-sm mt-1">
              Click Add Movie to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-zinc-500 text-sm mb-4">
              {movies.length} movie{movies.length !== 1 ? "s" : ""} in catalog
            </p>
            {movies.map((m, idx) => (
              <div
                key={m.id.toString()}
                data-ocid={`admin.item.${idx + 1}`}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex gap-3 items-center hover:border-zinc-700 transition-colors"
              >
                <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                  {m.thumbnailUrl ? (
                    <img
                      src={m.thumbnailUrl}
                      alt={m.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-5 h-5 text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight truncate">
                    {m.title}
                  </p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {m.year.toString()} · {m.language} · {m.genre}
                  </p>
                  {m.featured && (
                    <span className="inline-block mt-1 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button
                    data-ocid={`admin.edit_button.${idx + 1}`}
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(m)}
                    className="text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 h-8 w-8 p-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    data-ocid={`admin.delete_button.${idx + 1}`}
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(m)}
                    className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <MovieFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={formData}
        editId={editId}
        onSaved={fetchMovies}
        actor={actor}
      />
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent
          data-ocid="admin.dialog"
          className="bg-zinc-900 border-zinc-700 text-white"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Movie?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will permanently remove{" "}
              <strong className="text-white">{deleteTarget?.title}</strong> from
              the catalog. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.cancel_button"
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 bg-transparent"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.confirm_button"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );

  const handleUnlock = () => setUnlocked(true);
  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  };

  return unlocked ? (
    <AdminPanel onLogout={handleLogout} />
  ) : (
    <PinGate onUnlock={handleUnlock} />
  );
}
