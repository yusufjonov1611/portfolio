export const initialProfileData = {
  personal: {
    handle: "ABDULLOH",
    realName: "Abdulloh Yusufjonov",
    title: "Ethical Hacker & Full-Stack Developer",
    tagline: "Kiber-xavfsizlik, tarmoq tahlili va yuqori xavfsiz dasturiy yechimlar.",
    status: "STATUS: ACTIVE // MONITORING",
    location: "Toshkent, O'zbekiston (UTC+5)",
    clearanceLevel: "PRACTITIONER // ETHICAL LABS",
    avatarIcon: "terminal",
    bio: "Assalomu alaykum! Men Abdulloh Yusufjonov — axborot xavfsizligi mutaxassisi (Ethical Hacker) va Full-Stack dasturchiman. Asosan Linux tizimlari, tarmoq xavfsizligi, web ilovalardagi zaifliklarni (OWASP Top 10) tahlil qilish, Python yordamida avtomatlashtirilgan kiber-skriptlar yozish hamda amaliy CTF laboratoriyalarida tajriba oshirish bilan shug'ullanaman.",
    stats: [
      { label: "CTF & Labs", value: "120+" },
      { label: "Kiber Skriptlar", value: "25+" },
      { label: "GitHub Repolar", value: "18+" },
      { label: "Himoyalangan Tizimlar", value: "100%" }
    ]
  },
  skills: [
    {
      category: "Kiber-xavfsizlik & Tarmoq (Security & Networking)",
      color: "#00ff9d",
      items: [
        { name: "Linux OS boshqaruvi (Kali Linux, Ubuntu)", level: 88, tools: "Bash, CLI, Cron, Permissions, SSH" },
        { name: "Tarmoq protokollari tahlili (TCP/IP, DNS, HTTP/S)", level: 85, tools: "Wireshark, Netcat, Traceroute, Tcpdump" },
        { name: "Tarmoq skanerlash va razvedka (Reconnaissance)", level: 84, tools: "Nmap, Masscan, Ping sweep, OSINT" },
        { name: "Web xavfsizlik asoslari (OWASP Top 10)", level: 80, tools: "Burp Suite, SQLMap, Gobuster, Nikto" }
      ]
    },
    {
      category: "Dasturlash & Skripting (Coding & Automation)",
      color: "#00e5ff",
      items: [
        { name: "Python kiber-skripting va avtomatlashtirish", level: 86, tools: "Requests, Sockets, Scapy, BeautifulSoup, Asyncio" },
        { name: "Bash skriptlar (Linux jarayonlarini tezlashtirish)", level: 82, tools: "Shell scripting, Grep, Sed, Awk, Regex" },
        { name: "Frontend & Web asoslari", level: 80, tools: "HTML5, CSS3, JavaScript, React asoslari" },
        { name: "Ma'lumotlar bazasi va so'rovlar", level: 75, tools: "PostgreSQL, MySQL, SQLite, SQL injections testing" }
      ]
    },
    {
      category: "Amaliy Laboratoriyalar & Asboblar (Labs & Defense)",
      color: "#ffb703",
      items: [
        { name: "CTF & Amaliy Mashg'ulotlar (Capture The Flag)", level: 85, tools: "TryHackMe, HackTheBox, VulnHub" },
        { name: "Virtualizatsiya va sinov muhitlari", level: 84, tools: "VirtualBox, VMware, Docker asoslari" },
        { name: "Kriptografiya va Parollar tahlili", level: 78, tools: "John the Ripper, Hashcat, MD5, SHA-256, RSA asoslari" },
        { name: "Git & Loyihalarni boshqarish", level: 82, tools: "Git, GitHub, CI/CD asoslari" }
      ]
    }
  ],
  projects: [
    {
      id: "port-recon-tool",
      title: "PyRecon Port & Service Scanner",
      subtitle: "Avtomatlashtirilgan port va xizmatlar tahlilchisi",
      category: "Offensive Tooling",
      status: "YARATILGAN",
      badge: "PYTHON ASBOB",
      description: "Python Socket va Requests kutubxonalari yordamida yozilgan, ochiq portlar va ularda ishlayotgan xizmatlarni aniqlovchi engil tarmoq skaneri.",
      tags: ["Python", "Sockets", "Networking", "CLI"],
      githubUrl: "https://github.com/yusufjonov1611",
      demoUrl: "#",
      highlights: [
        "Ko'p oqimli (Multi-threaded) tezkor tekshiruv",
        "Banner grabbing orqali server versiyasini aniqlash",
        "Natijalarni faylga saqlash imkoniyati"
      ]
    },
    {
      id: "web-directory-buster",
      title: "SubRoute Finder",
      subtitle: "Yashirin yo'llar va admin panellar qidiruvchisi",
      category: "Web Security",
      status: "STABIL",
      badge: "RECON",
      description: "Saytlardagi ochiq qolgan fayllar (robots.txt, .git, .env) va yashirin boshqaruv panellarini lug'at (wordlist) asosida qidiruvchi skript.",
      tags: ["Python", "Requests", "Wordlists", "HTTP Status"],
      githubUrl: "https://github.com/yusufjonov1611",
      demoUrl: "#",
      highlights: [
        "Xatoliklarni (403, 404, 301) filtrlash",
        "Maxsus User-Agent yuborish imkoniyati",
        "Tezkor qidiruv tezligi"
      ]
    },
    {
      id: "secure-notes-api",
      title: "CryptoVault Notes",
      subtitle: "Shifrlangan qaydlar va ma'lumotlar saqlovchisi",
      category: "Full-Stack Dev",
      status: "ISHLAB CHIQILGAN",
      badge: "XAVFSIZLIK",
      description: "Foydalanuvchi ma'lumotlarini AES shifrlash orqali saqlovchi va parolsiz ochib bo'lmaydigan veb-ilova.",
      tags: ["JavaScript", "Node.js", "Express", "Crypto", "React"],
      githubUrl: "https://github.com/yusufjonov1611",
      demoUrl: "#",
      highlights: [
        "Parollar serverda shifrlangan holda saqlanadi",
        "JWT orqali xavfsiz avtorizatsiya",
        "SQL Injection va XSS himoyasi"
      ]
    }
  ],
  contact: {
    email: "yusufjonov.me@gmail.com",
    telegram: "@yusufjonov_me",
    telegramUrl: "https://t.me/yusufjonov_me",
    github: "github.com/yusufjonov1611",
    githubUrl: "https://github.com/yusufjonov1611",
    linkedin: "linkedin.com/in/yusufjonov1611",
    linkedinUrl: "https://linkedin.com/",
    pgpKeyId: "0x89F3A2B19904E4D2",
    pgpFingerprint: "E612 8A09 3B45 FC81 2940  102B 89F3 A2B1 9904 E4D2"
  }
};
