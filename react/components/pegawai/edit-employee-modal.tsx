"use client"

import type { ChangeEvent, FormEvent } from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Pegawai } from "@/lib/types"
import { departemenList, statusList, golonganList } from "@/lib/mock-data"

const agamaList = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "Lainnya"]
const jenisKelaminList = ["Laki-laki", "Perempuan"]

interface EditEmployeeModalProps {
  pegawai: Pegawai | null
  isOpen: boolean
  onClose: () => void
  onSave: (pegawai: Pegawai, fotoFile?: File | null) => Promise<void> | void
}

export function EditEmployeeModal({
  pegawai,
  isOpen,
  onClose,
  onSave,
}: EditEmployeeModalProps) {
  const [formData, setFormData] = useState<Partial<Pegawai>>({})
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | undefined>(undefined)
  const { toast } = useToast()

  useEffect(() => {
    if (pegawai) {
      setFormData(pegawai)
      setFotoPreview(pegawai.foto)
      setFotoFile(null)
    }
  }, [pegawai])

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFotoFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setFotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (formData && pegawai) {
      try {
        await onSave({ ...pegawai, ...formData } as Pegawai, fotoFile)
        toast({
          title: "Data berhasil disimpan",
          description: `Data pegawai ${formData.nama} telah diperbarui.`,
        })
      } catch {
        toast({
          title: "Gagal menyimpan data",
          description: "Terjadi kesalahan saat menyimpan perubahan.",
          variant: "destructive",
        })
        return
      }
    }
    onClose()
  }

  if (!pegawai) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border-border bg-card p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Edit Data Pegawai
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/20 p-3">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border bg-secondary">
              {fotoPreview ? (
                <img src={fotoPreview} alt="Foto Pegawai" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">Foto</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="foto" className="text-sm text-foreground">Foto Profil</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('foto-edit')?.click()}>
                  <Camera className="mr-2 h-4 w-4" />
                  Ganti Foto
                </Button>
                <input id="foto-edit" type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
              </div>
            </div>
          </div>

          {/* Identitas Section */}
          <h3 className="text-base font-semibold text-foreground border-b border-border pb-2">Identitas Pegawai</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nipPegawai" className="text-sm text-foreground">
                NIP
              </Label>
              <Input
                id="nipPegawai"
                value={formData.nipPegawai || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nipPegawai: e.target.value })
                }
                className="bg-secondary text-sm"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama" className="text-sm text-foreground">
                Nama Lengkap
              </Label>
              <Input
                id="nama"
                value={formData.nama || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                className="bg-secondary text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jabatan" className="text-sm text-foreground">
                Jabatan
              </Label>
              <Input
                id="jabatan"
                value={formData.jabatan || ""}
                onChange={(e) =>
                  setFormData({ ...formData, jabatan: e.target.value })
                }
                className="bg-secondary text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departemen" className="text-sm text-foreground">
                Departemen
              </Label>
              <Select
                value={formData.departemen}
                onValueChange={(value) =>
                  setFormData({ ...formData, departemen: value })
                }
              >
                <SelectTrigger className="bg-secondary text-sm">
                  <SelectValue placeholder="Pilih Departemen" />
                </SelectTrigger>
                <SelectContent>
                  {departemenList.slice(1).map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="golongan" className="text-sm text-foreground">
              Golongan
            </Label>
            <Select
              value={formData.golongan}
              onValueChange={(value) =>
                setFormData({ ...formData, golongan: value })
              }
            >
              <SelectTrigger className="bg-secondary text-sm">
                <SelectValue placeholder="Pilih Golongan" />
              </SelectTrigger>
              <SelectContent>
                {golonganList.map((gol) => (
                  <SelectItem key={gol} value={gol}>{gol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Data Pribadi Section */}
          <h3 className="text-base font-semibold text-foreground border-b border-border pb-2 pt-2">Data Pribadi</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tempatLahir" className="text-sm text-foreground">
                Tempat Lahir
              </Label>
              <Input
                id="tempatLahir"
                value={(formData as any).tempatLahir || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tempatLahir: e.target.value } as any)
                }
                className="bg-secondary text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggalLahir" className="text-sm text-foreground">
                Tanggal Lahir
              </Label>
              <Input
                id="tanggalLahir"
                type="date"
                value={(formData as any).tanggalLahir || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tanggalLahir: e.target.value } as any)
                }
                className="bg-secondary text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="jenisKelamin" className="text-sm text-foreground">
                Jenis Kelamin
              </Label>
              <Select
                value={(formData as any).jenisKelamin}
                onValueChange={(value) =>
                  setFormData({ ...formData, jenisKelamin: value } as any)
                }
              >
                <SelectTrigger className="bg-secondary text-sm">
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  {jenisKelaminList.map((jk) => (
                    <SelectItem key={jk} value={jk}>{jk}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="agama" className="text-sm text-foreground">Agama</Label>
              <Select
                value={(formData as any).agama}
                onValueChange={(value) =>
                  setFormData({ ...formData, agama: value } as any)
                }
              >
                <SelectTrigger className="bg-secondary text-sm">
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  {agamaList.map((ag) => (
                    <SelectItem key={ag} value={ag}>{ag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Alamat Domisili Section */}
          <h3 className="text-base font-semibold text-foreground border-b border-border pb-2 pt-2">Alamat Domisili</h3>
          <div className="space-y-2">
            <Label htmlFor="alamat" className="text-sm text-foreground">Alamat Lengkap</Label>
            <Input
              id="alamat"
              value={(formData as any).alamat || ""}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value } as any)}
              className="bg-secondary text-sm"
            />
          </div>

          {/* Status & Kontak Section */}
          <h3 className="text-base font-semibold text-foreground border-b border-border pb-2 pt-2">Status & Kontak</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm text-foreground">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as Pegawai["status"],
                  })
                }
              >
                <SelectTrigger className="bg-secondary text-sm">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusList.slice(1).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="noHp" className="text-sm text-foreground">
                Nomor HP
              </Label>
              <Input
                id="noHp"
                value={formData.noHp || ""}
                onChange={(e) =>
                  setFormData({ ...formData, noHp: e.target.value })
                }
                className="bg-secondary text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-secondary text-sm"
            />
          </div>

          <DialogFooter className="gap-2 pt-4 flex-col-reverse sm:flex-row">
            <Button type="button" variant="outline" onClick={onClose} className="text-sm">
              Batal
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground text-sm">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
