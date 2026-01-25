import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { Task, AdminUser, User } from './types';

export const users: User[] = [
  {
    id: uuidv4(),
    email: 'user1@test.com',
    password: bcrypt.hashSync('123456', 10)
  },
  {
    id: uuidv4(),
    email: 'user2@test.com',
    password: bcrypt.hashSync('123456', 10)
  }
];

export const adminUsers: AdminUser[] = [
  {
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'Admin',
    password: bcrypt.hashSync('admin123', 10)
  },
  {
    id: uuidv4(),
    name: 'Moderator User',
    email: 'moderator@test.com',
    role: 'Moderator',
    password: bcrypt.hashSync('mod123', 10)
  },
  {
    id: uuidv4(),
    name: 'Viewer User',
    email: 'viewer@test.com',
    role: 'Viewer',
    password: bcrypt.hashSync('viewer123', 10)
  }
];

export const tasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Bilgisayar Ekranı Değişimi',
    description: 'Ofisteki bilgisayar ekranı bozuldu, değiştirilmesi gerekiyor. 27 inç, 4K çözünürlük tercihen.',
    priority: 'high',
    category: 'Teknik Destek',
    status: 'pending',
    createdBy: users[0].email,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Yıllık İzin Talebi - Mart',
    description: '10-20 Mart tarihleri arasında yıllık izin kullanmak istiyorum.',
    priority: 'normal',
    category: 'İzin Talebi',
    status: 'approved',
    createdBy: users[1].email,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Yazıcı Kartuşu Siparişi',
    description: 'HP LaserJet için siyah ve renkli kartuş siparişi verilmesi gerekiyor.',
    priority: 'normal',
    category: 'Satın Alma',
    status: 'approved',
    createdBy: users[0].email,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'VPN Bağlantı Sorunu',
    description: 'Evden çalışırken VPN bağlantısı sürekli kopuyor. IT desteğine ihtiyaç var.',
    priority: 'urgent',
    category: 'Teknik Destek',
    status: 'pending',
    createdBy: users[1].email,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Ofis Masa Lambasınız Alımı',
    description: 'Masa çalışma alanı için LED masa lambası talep ediyorum.',
    priority: 'low',
    category: 'Satın Alma',
    status: 'rejected',
    createdBy: users[0].email,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    rejectionReason: 'Bütçe kısıtlaması nedeniyle onaylanamadı.'
  },
  {
    id: uuidv4(),
    title: 'Toplantı Odası Rezervasyonu',
    description: '25 Ocak Cuma günü saat 14:00-16:00 arası toplantı odası rezervasyonu.',
    priority: 'normal',
    category: 'Diğer',
    status: 'approved',
    createdBy: users[1].email,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Klavye ve Mouse Değişimi',
    description: 'Ergonomik klavye ve mouse talep ediyorum. Bilek ağrıları başladı.',
    priority: 'high',
    category: 'Teknik Destek',
    status: 'pending',
    createdBy: users[0].email,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'E-posta Sistemi Erişim Sorunu',
    description: 'Outlook\'ta e-posta gönderme ve alma yapamıyorum. Hata kodu: 0x800CCC0E',
    priority: 'urgent',
    category: 'Teknik Destek',
    status: 'approved',
    createdBy: users[1].email,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Hastalık İzni - 22 Ocak',
    description: 'Grip nedeniyle 22 Ocak için hastalık raporu sunuyorum.',
    priority: 'high',
    category: 'İzin Talebi',
    status: 'approved',
    createdBy: users[0].email,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Kahve Makinesi Bakımı',
    description: 'Ortak alandaki kahve makinesi temizlik ve bakım istiyor.',
    priority: 'low',
    category: 'Diğer',
    status: 'pending',
    createdBy: users[1].email,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Yazılım Lisans Yenileme',
    description: 'Adobe Creative Cloud lisansının yenilenmesi gerekiyor. 28 Ocak\'ta sona eriyor.',
    priority: 'urgent',
    category: 'Satın Alma',
    status: 'pending',
    createdBy: users[0].email,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Ofis Koltuk Tamiri',
    description: 'Çalışma koltuğumun tekerleği kırıldı, tamir veya değişim gerekiyor.',
    priority: 'normal',
    category: 'Diğer',
    status: 'approved',
    createdBy: users[1].email,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'İnternet Hızı Düşüklüğü',
    description: 'Ofiste internet hızı çok düşük, iş verimliliğini etkiliyor. Speedtest sonuçları: 5 Mbps',
    priority: 'high',
    category: 'Teknik Destek',
    status: 'pending',
    createdBy: users[0].email,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Ekstra Monitör Talebi',
    description: 'Dual monitör kurulumu için ikinci bir ekran talep ediyorum.',
    priority: 'low',
    category: 'Satın Alma',
    status: 'rejected',
    createdBy: users[1].email,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    rejectionReason: 'Mevcut ekran yeterli görülmüştür.'
  },
  {
    id: uuidv4(),
    title: 'Klima Ayar Talebi',
    description: 'Ofis sıcaklığı çok düşük, klima sıcaklığının ayarlanması gerekiyor.',
    priority: 'normal',
    category: 'Diğer',
    status: 'approved',
    createdBy: users[0].email,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Uzaktan Çalışma İzni',
    description: 'Hafta boyunca evden çalışma izni talep ediyorum.',
    priority: 'normal',
    category: 'İzin Talebi',
    status: 'pending',
    createdBy: users[1].email,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Güvenlik Kartı Kayıp',
    description: 'Ofis giriş kartımı kaybettim, yeni kart çıkarılması gerekiyor.',
    priority: 'urgent',
    category: 'Diğer',
    status: 'approved',
    createdBy: users[0].email,
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Kulaklık Alımı',
    description: 'Gürültülü ortam nedeniyle noise-cancelling kulaklık talep ediyorum.',
    priority: 'normal',
    category: 'Satın Alma',
    status: 'pending',
    createdBy: users[1].email,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Yazıcı Kağıt Sıkışması',
    description: 'Ortak yazıcıda sürekli kağıt sıkışması oluyor, teknik servis gerekli.',
    priority: 'high',
    category: 'Teknik Destek',
    status: 'approved',
    createdBy: users[0].email,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Park Yeri Talebi',
    description: 'Ofis otoparkında sabit park yeri tahsis edilmesi talebi.',
    priority: 'low',
    category: 'Diğer',
    status: 'rejected',
    createdBy: users[1].email,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    rejectionReason: 'Tüm park yerleri dolu, bekleme listesine alındınız.'
  }
];
