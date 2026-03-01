"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { User, Camera, Save, Upload, Shield, KeyRound } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState<"profil" | "keamanan">("profil")
  const { toast } = useToast()
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>("")
  
  // State for Profile
  const [profileData, setProfileData] = useState({
    nama: "Admin",
    email: "admin@instansi.go.id",
    telepon: "081234567890"
  })

  useEffect(() => {
    let mounted = true

    fetch('/api/admin/profile')
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return

        setProfileData({
          nama: json.nama ?? 'Admin',
          email: json.email ?? 'admin@instansi.go.id',
          telepon: json.telepon ?? '',
        })

        setPhotoPreview(json.foto ?? '')
      })
      .catch(() => {
        // keep default state
      })

    return () => {
      mounted = false
    }
  }, [])

  // State for Password
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  })

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)

    const formData = new FormData()
    formData.append('nama', profileData.nama)
    formData.append('email', profileData.email)
    formData.append('telepon', profileData.telepon)

    if (photoFile) {
      formData.append('foto', photoFile)
    }

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan profil')
      }

      const json = await response.json()
      setPhotoPreview(json.foto ?? photoPreview)
      setPhotoFile(null)
      window.dispatchEvent(new Event('admin-profile-updated'))

      toast({
        title: "Profil diperbarui",
        description: "Informasi profil Anda berhasil disimpan.",
      })
    } catch {
      toast({
        title: "Gagal memperbarui profil",
        description: "Silakan periksa data dan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Gagal mengubah password",
        description: "Konfirmasi password tidak cocok.",
        variant: "destructive"
      })
      return
    }

    setSavingPassword(true)
    try {
      const response = await fetch('/api/admin/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: passwordData.current,
          new_password: passwordData.new,
          new_password_confirmation: passwordData.confirm,
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal mengubah password')
      }

      toast({
        title: "Password diubah",
        description: "Password Anda berhasil diperbarui. Silakan login ulang.",
      })
      setPasswordData({ current: "", new: "", confirm: "" })
    } catch {
      toast({
        title: "Gagal mengubah password",
        description: "Pastikan password saat ini benar.",
        variant: "destructive",
      })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <AdminLayout title="Pengaturan">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Tabs Navigation */}
        <div className="flex space-x-1 rounded-xl bg-secondary/50 p-1">
          <button
            onClick={() => setActiveTab("profil")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              activeTab === "profil"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            )}
          >
            <User className="h-4 w-4" />
            Profil
          </button>
          <button
            onClick={() => setActiveTab("keamanan")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              activeTab === "keamanan"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            )}
          >
            <Shield className="h-4 w-4" />
            Keamanan
          </button>
        </div>

        {/* Content Area */}
        {activeTab === "profil" ? (
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            {/* Left Column: Photo Section */}
            <Card className="p-6 flex flex-col items-center text-center space-y-4 h-fit border-border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={photoPreview || undefined} />
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                    {(profileData.nama || 'AD').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0">
                  <Button
                    type="button"
                    size="icon"
                    className="rounded-full h-8 w-8 shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Foto Profil</h3>
                <p className="text-xs text-muted-foreground">
                  Foto ini akan ditampilkan di topbar (pojok kanan atas).
                </p>
                <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded-md border border-border">
                  Format PNG, JPG (Maks. 5 MB)
                </div>
              </div>
              <Button variant="outline" className="w-full text-xs" onClick={() => document.getElementById('photo-upload')?.click()}>
                <Upload className="mr-2 h-3 w-3" />
                Unggah Foto
              </Button>
              <input
                type="file"
                id="photo-upload"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleFotoChange}
              />
            </Card>

            {/* Right Column: Info Form */}
            <Card className="p-6 border-border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Informasi Admin</h3>
                <p className="text-sm text-muted-foreground">Kelola informasi pribadi dan kontak Anda.</p>
              </div>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input 
                    id="nama" 
                    value={profileData.nama} 
                    onChange={(e) => setProfileData({...profileData, nama: e.target.value})}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileData.email} 
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telepon">Nomor Telepon</Label>
                  <Input 
                    id="telepon" 
                    value={profileData.telepon} 
                    onChange={(e) => setProfileData({...profileData, telepon: e.target.value})}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="gap-2 bg-primary text-primary-foreground" disabled={savingProfile}>
                    <Save className="h-4 w-4" />
                    {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        ) : (
          /* Security Tab Content */
          <Card className="p-6 max-w-2xl mx-auto border-border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
            <div className="mb-6 flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Ubah Password</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Untuk menjaga keamanan akun, Anda dapat mengubah kata sandi di sini. Pastikan kata sandi baru kuat dan berbeda dari kata sandi sebelumnya. Setelah diubah, Anda akan diminta untuk masuk kembali menggunakan kata sandi yang baru.
                </p>
              </div>
            </div>
            
            <form onSubmit={handlePasswordSave} className="space-y-4 border-t border-border pt-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Password Saat Ini</Label>
                <Input 
                  id="current-password" 
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  className="bg-secondary/50"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password Baru</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    className="bg-secondary/50"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button type="submit" className="gap-2 bg-primary text-primary-foreground" disabled={savingPassword}>
                  <Save className="h-4 w-4" />
                  {savingPassword ? 'Menyimpan...' : 'Ubah Password'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}