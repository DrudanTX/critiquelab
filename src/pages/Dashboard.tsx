import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Filter,
  Search
} from "lucide-react";

export default function Dashboard() {
  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container px-4 md:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Submit your work for rigorous critique
              </p>
            </div>
            <Button variant="hero" asChild>
              <Link to="/dashboard">
                <Plus size={18} className="mr-2" />
                New Critique
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              icon={FileText} 
              label="Total Submissions" 
              value="0" 
            />
            <StatCard 
              icon={Clock} 
              label="In Progress" 
              value="0" 
            />
            <StatCard 
              icon={CheckCircle} 
              label="Completed" 
              value="0" 
            />
            <StatCard 
              icon={AlertTriangle} 
              label="Issues Found" 
              value="0" 
            />
          </div>

          {/* Main Content Area */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border p-6 md:p-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Submit for Critique
                </h2>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 md:p-12 text-center hover:border-accent/50 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    Drop your document here
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, DOCX, TXT, and Markdown files
                  </p>
                </div>

                {/* Or paste text */}
                <div className="mt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-sm text-muted-foreground">or paste your text</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <textarea 
                    className="w-full h-40 p-4 bg-background border border-border rounded-lg resize-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all"
                    placeholder="Paste your essay, argument, or research paper here..."
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <Button variant="hero" size="lg" disabled>
                    Start Critique
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Recent Critiques
                </h3>
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No critiques yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submit your first document to get started
                  </p>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Tips for Better Critiques
                </h3>
                <ul className="space-y-3">
                  <TipItem text="Include your thesis statement clearly" />
                  <TipItem text="Provide context for your argument" />
                  <TipItem text="Include your citations if applicable" />
                  <TipItem text="Specify your target audience" />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
      <span className="text-muted-foreground">{text}</span>
    </li>
  );
}
