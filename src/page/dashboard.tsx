import { useEffect, useState } from "react";
import {
  FolderOpen,
  Search,
  Trash2,
  Loader2,
  Eye,
  Calendar,
  AlertTriangle,
  File,
} from "lucide-react";
import { Navbar } from "../components/navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import CreateProject from "../components/create-project";
import { useToast } from "../hooks/use-toast";
import ExportDialog from "../components/export-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk Dialog Viewer
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [projectCodes, setProjectCodes] = useState<any[]>([]);
  const [isFetchingDetails, setIsFetchingDetails] = useState<number | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  const { toast } = useToast();

  const getAllProject = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/`);
      const data: Project[] = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete(id);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectToDelete}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal menghapus");

      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete));
      toast({ title: "Project dihapus" });
    } catch (error) {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    } finally {
      setProjectToDelete(null);
    }
  };

  // --- FUNGSI UTAMA: VIEW & EXPORT ---
  const handleViewReport = async (projectId: number, projectName: string) => {
    setIsFetchingDetails(projectId);
    try {
      // Fetch data lengkap project termasuk semua code history
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/export/`);
      if (!response.ok) throw new Error("Gagal mengambil data");

      const data = await response.json();

      // Data 'codes' adalah array riwayat analisis
      const history = data.project.codes || [];

      if (history.length > 0) {
        setProjectCodes(history);
        setSelectedProjectName(projectName);
        setShowExportDialog(true);
      } else {
        toast({
          title: "Belum Ada Data",
          description: "Project ini belum memiliki analisis yang disimpan.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat data project.", variant: "destructive" });
    } finally {
      setIsFetchingDetails(null);
    }
  };

  useEffect(() => {
    getAllProject();
  }, []);

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFBFF] dark:bg-neutral-950 font-sans tracking-tight">
      <Navbar />

      <div className="max-w-5xl px-8 pt-32 pb-20 mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 shadow-lg shadow-gray-200/50 dark:shadow-none flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                Project & <span className="text-gray-500 dark:text-emerald-500 font-normal">Laporan</span>
              </h1>
            </div>
          </div>
          <CreateProject onProjectCreated={getAllProject} />
        </div>

        {/* Search */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-500" />
            <Input
              placeholder="Cari project berdasarkan nama..."
              className="pl-10 h-12 text-sm rounded-2xl bg-white dark:bg-gray-900 shadow-md shadow-gray-100/50 dark:shadow-none border-gray-200 dark:border-gray-800 placeholder:text-gray-400 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* List Project */}
        <div className="grid grid gap-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-emerald-200 animate-spin" />
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none transition-all duration-300"
              >
                <div className="relative flex items-center gap-4 mb-4 md:mb-0 overflow-hidden">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-none flex items-center justify-center">
                    <File className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors truncate">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 dark:text-white">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                      {project.description && (
                        <span className="truncate max-w-[200px] text-gray-400">
                          {project.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-gray-100 md:border-0">
                  <Button
                    className="flex-1 md:flex-none h-10 px-5 rounded-xl bg-gray-900 dark:bg-emerald-600 text-white hover:bg-gray-800 dark:hover:bg-emerald-700 font-medium text-sm transition-all flex items-center gap-2"
                    onClick={() => handleViewReport(project.id, project.name)}
                    disabled={isFetchingDetails === project.id}
                  >
                    {isFetchingDetails === project.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    Buka Laporan
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                    onClick={(e) => handleDeleteProject(project.id, e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="py-16 text-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm dark:shadow-none flex flex-col items-center gap-4">
              <div className="bg-gray-50 border border-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Belum ada project</h3>
                <p className="text-sm text-gray-500 mt-1">Buat project pertama Anda untuk mulai menganalisis kode.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODAL (Menampilkan History Analisis) */}
      {showExportDialog && (
        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          projectName={selectedProjectName}
          projectCodes={projectCodes} // Kirim seluruh array history
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border-none bg-white dark:bg-gray-900 shadow-2xl dark:shadow-none p-8 max-w-[400px]">
          <AlertDialogHeader>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner dark:shadow-none">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <AlertDialogTitle className="text-xl font-bold text-gray-900">Hapus Project?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                  Project ini beserta seluruh riwayat analisisnya akan dihapus permanen.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-3 mt-8 sm:justify-center">
            <AlertDialogCancel className="h-12 rounded-xl font-bold border-gray-200 text-gray-600 hover:bg-gray-50 mt-0">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProject}
              className="h-12 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-white shadow-lg shadow-red-100 dark:shadow-none transition-all active:scale-95"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DashboardPage;
