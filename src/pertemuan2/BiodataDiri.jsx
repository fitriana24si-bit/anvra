export default function BiodataDiri() { //  PARENT
  return (
    <div>

  
      <div className="section">
        <HeaderBio />
        <Greeting />
        <StatusBadge />
      </div>


      <div className="section">
        <UserCard 
          nama="Fitriana Tasya"
          nim="2457301058"
          tanggal="17 Desember 2005"
          alamat="Padang, Sumatera Barat"
          hobi="Desain & Menulis"
          prodi="Sistem Informasi"
          kampus="Politeknik Caltex Riau"
        />
      </div>

  
      <div className="section">
        <QuoteText />
      </div>

   
      <div className="section">
        <SkillList />
      </div>

   
      <div className="section">
        <SocialMedia />
      </div>

    </div>
  )
}

// --- CHILD COMPONENTS ---

function HeaderBio() {
  return (
    <div>
      <h2>Biodata Saya</h2>
      <p className="subtitle">Portofolio Mahasiswa</p>
    </div>
  );
}

function Greeting() {
  return (
    <p className="greeting">
      Belajar React itu menyenangkan 🌱
    </p>
  );
}

function StatusBadge() {
  return (
    <div className="badge-wrapper">
      <span className="badge">● Active Student</span>
    </div>
  );
}

function UserCard(props) {
  return (
    <div className="user-card">
      <strong>Nama</strong><span>{props.nama}</span>
      <strong>NIM</strong><span>{props.nim}</span>
      <strong>Tanggal Lahir</strong><span>{props.tanggal}</span>
      <strong>Alamat</strong><span>{props.alamat}</span>
      <strong>Hobi</strong><span>{props.hobi}</span>
      <strong>Prodi</strong><span>{props.prodi}</span>
      <strong>Kampus</strong><span>{props.kampus}</span>
    </div>
  )
}

function QuoteText() {
  return (
    <div>
      <p className="quote-main">
        GROW SLOWLY, BUT NEVER STOP 🌿
      </p>
      <p className="quote-sub">
        learning... improving... evolving...
      </p>
    </div>
  )
}

function SkillList() {
  return (
    <div className="skills">
      <p className="skill-title">Skills</p>
      <ul>
        <li>HTML</li>
        <li>CSS</li>
        <li>React</li>
        <li>UI Design</li>
      </ul>
    </div>
  )
}

function SocialMedia() {
  return (
    <div className="social">
      Instagram: @ana.tasya
    </div>
  );
}