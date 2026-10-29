import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SAVE_KEY = "halloween-story-maker-save-v1";

/* ---------- データ型 ---------- */

interface Hero {
  id: string;
  label: string;
  name: string;
  emoji: string;
}

interface Place {
  id: string;
  label: string;
  emoji: string;
  mood: string;
}

interface Item {
  id: string;
  label: string;
  short: string;
  emoji: string;
  use: string;
}

interface Encounter {
  id: string;
  label: string;
  emoji: string;
  greet: string;
}

interface Ending {
  id: string;
  label: string;
  emoji: string;
  text: string;
}

interface Story {
  id: string;
  title: string;
  sentences: string[];
  emojis: string;
}

interface SaveData {
  total: number;
  favorites: Story[];
}

/* ---------- データ（怖くなく、温かい内容だけ） ---------- */

const HEROES: Hero[] = [
  { id: "popo", label: "おばけの ポポ", name: "ポポ", emoji: "👻" },
  { id: "kabo", label: "かぼちゃの カボ", name: "カボ", emoji: "🎃" },
  { id: "kuroneko", label: "くろねこ", name: "くろねこ", emoji: "🐈‍⬛" },
  {
    id: "yuchan",
    label: "まほうつかいの ゆうちゃん",
    name: "ゆうちゃん",
    emoji: "🧙‍♀️",
  },
  {
    id: "taro",
    label: "ゆうきのある たろう",
    name: "たろう",
    emoji: "🧒",
  },
  { id: "mimi", label: "うさぎの ミミ", name: "ミミ", emoji: "🐰" },
];

const PLACES: Place[] = [
  {
    id: "oyashiki",
    label: "ふるい おやしき",
    emoji: "🏚️",
    mood: "まどから あたたかい あかりが もれていました",
  },
  {
    id: "mori",
    label: "まほうの もり",
    emoji: "🌲",
    mood: "きの あいだから ほしの あかりが きらきら ふってきました",
  },
  {
    id: "kabocha",
    label: "かぼちゃ ばたけ",
    emoji: "🎃",
    mood: "おおきな かぼちゃが たくさん ならんでいました",
  },
  {
    id: "okashi",
    label: "おかしの いえ",
    emoji: "🍬",
    mood: "あまい いい かおりが ふわっと しました",
  },
  {
    id: "oka",
    label: "つきあかりの おか",
    emoji: "🌙",
    mood: "まるい おつきさまが やさしく てらしていました",
  },
  {
    id: "machi",
    label: "ほしぞら みち",
    emoji: "⭐",
    mood: "そら いっぱいに ほしが またたいていました",
  },
];

const ITEMS: Item[] = [
  {
    id: "lantern",
    label: "ひかる ランタン",
    short: "ひかる ランタン",
    emoji: "🏮",
    use: "ランタンの あかりが、みちを ぽかぽか あかるく てらしました",
  },
  {
    id: "kagi",
    label: "まほうの かぎ",
    short: "まほうの かぎ",
    emoji: "🗝️",
    use: "かぎを まわすと、ちいさな とびらが ゆっくり ひらきました",
  },
  {
    id: "manto",
    label: "ほしの マント",
    short: "ほしの マント",
    emoji: "🌟",
    use: "マントを ひろげると、ほしの ひかりが キラキラ ゆれました",
  },
  {
    id: "candy",
    label: "にじいろ キャンディ",
    short: "にじいろ キャンディ",
    emoji: "🍭",
    use: "キャンディを なめると、こころが ふわっと あたたかく なりました",
  },
  {
    id: "chizu",
    label: "ふしぎな ちず",
    short: "ふしぎな ちず",
    emoji: "🗺️",
    use: "ちずを ひろげると、すすむ みちが ほしの マークで 光りました",
  },
  {
    id: "suzu",
    label: "つきの すず",
    short: "つきの すず",
    emoji: "🔔",
    use: "すずを ならすと、チリンと かわいい おとが ひびきました",
  },
];

const ENCOUNTERS: Encounter[] = [
  {
    id: "majo",
    label: "やさしい まじょ",
    emoji: "🧙‍♀️",
    greet: "「こんばんは！ いっしょに あそぼう」と にっこり わらいました",
  },
  {
    id: "skeleton",
    label: "わらう スケルトン",
    emoji: "💀",
    greet: "カタカタと たのしそうに わらって、手を ふりました",
  },
  {
    id: "koumori",
    label: "おどる コウモリ",
    emoji: "🦇",
    greet: "くるくる おどりながら「まってたよ！」と いいました",
  },
  {
    id: "fukuro",
    label: "大きな フクロウ",
    emoji: "🦉",
    greet: "「よく きたね」と やさしい こえで いいました",
  },
  {
    id: "obake2",
    label: "ちいさな おばけ",
    emoji: "👻",
    greet: "かげから ぴょこっと 出てきて、ぺこりと おじぎを しました",
  },
  {
    id: "kabocha",
    label: "うたう かぼちゃ",
    emoji: "🎃",
    greet: "たのしい うたを うたいながら、ゆらゆら ゆれました",
  },
];

const ENDINGS: Ending[] = [
  {
    id: "okashi",
    label: "おかしを わけあった",
    emoji: "🍬",
    text: "さいごに、みんなで おかしを わけあって、にっこり わらいました",
  },
  {
    id: "tomodachi",
    label: "ともだちに なった",
    emoji: "🤝",
    text: "その日から、みんなは とても なかよしの ともだちに なりました",
  },
  {
    id: "dance",
    label: "ほしぞらで ダンスした",
    emoji: "💃",
    text: "さいごに、ほしぞらの 下で みんなで たのしく ダンスを しました",
  },
  {
    id: "pajama",
    label: "あたたかい スープを のんだ",
    emoji: "🍲",
    text: "さいごに、あたたかい スープを みんなで のんで、ほっと しました",
  },
  {
    id: "yume",
    label: "いい ゆめを みた",
    emoji: "🌙",
    text: "おうちに かえって ねむると、たのしい ゆめの つづきが 見られました",
  },
];

/* ---------- ユーティリティ ---------- */

function randomIndex(len: number): number {
  return Math.floor(Math.random() * len);
}

function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SaveData;
      if (typeof parsed.total === "number" && Array.isArray(parsed.favorites)) {
        return parsed;
      }
    }
  } catch {
    /* 読めなければ初期値で続行 */
  }
  return { total: 0, favorites: [] };
}

function speak(text: string) {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "ja-JP";
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  } catch {
    /* 読み上げが使えなくてもテキストで遊べる */
  }
}

function buildStory(
  hero: Hero,
  place: Place,
  item: Item,
  encounter: Encounter,
  ending: Ending,
): Story {
  const sentences = [
    `ある ハロウィンの よる、${hero.label}は ${place.label}へ 出かけました。${place.mood}。`,
    `${hero.name}の 手には ${item.label}が ありました。${item.use}。`,
    `すると、${encounter.label}が やってきました。${encounter.greet}。`,
    `${hero.name}は ${item.label}を 見せて、「いっしょに たんけんしよう！」と 言いました。みんなで わくわくしながら すすみました。`,
    `${ending.text}。`,
    `つきあかりの 下で、みんなの こころが ぽかぽかに なりました。おしまい。`,
  ];
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: `${hero.name}と ${item.short}`,
    sentences,
    emojis: `${hero.emoji} ${place.emoji} ${item.emoji} ${encounter.emoji} ${ending.emoji}`,
  };
}

/* ---------- アプリ ---------- */

type View = "select" | "story" | "favorites";

export default function App() {
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [view, setView] = useState<View>("select");
  const [heroIdx, setHeroIdx] = useState(() => randomIndex(HEROES.length));
  const [placeIdx, setPlaceIdx] = useState(() => randomIndex(PLACES.length));
  const [itemIdx, setItemIdx] = useState(() => randomIndex(ITEMS.length));
  const [encIdx, setEncIdx] = useState(() => randomIndex(ENCOUNTERS.length));
  const [endIdx, setEndIdx] = useState(() => randomIndex(ENDINGS.length));
  const [story, setStory] = useState<Story | null>(null);
  const [savedThis, setSavedThis] = useState(false);
  const [viewing, setViewing] = useState<Story | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch {
      /* 保存できなくても遊びは続けられる */
    }
  }, [save]);

  const hero = HEROES[heroIdx];
  const place = PLACES[placeIdx];
  const item = ITEMS[itemIdx];
  const encounter = ENCOUNTERS[encIdx];
  const ending = ENDINGS[endIdx];

  const canSpeak = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    [],
  );

  function generate(next: {
    hero: Hero;
    place: Place;
    item: Item;
    encounter: Encounter;
    ending: Ending;
  }) {
    const s = buildStory(
      next.hero,
      next.place,
      next.item,
      next.encounter,
      next.ending,
    );
    setStory(s);
    setSavedThis(false);
    setViewing(null);
    setView("story");
    setSave((prev) => ({ ...prev, total: prev.total + 1 }));
  }

  function handleRandom() {
    const h = randomIndex(HEROES.length);
    const p = randomIndex(PLACES.length);
    const i = randomIndex(ITEMS.length);
    const e = randomIndex(ENCOUNTERS.length);
    const en = randomIndex(ENDINGS.length);
    setHeroIdx(h);
    setPlaceIdx(p);
    setItemIdx(i);
    setEncIdx(e);
    setEndIdx(en);
    generate({
      hero: HEROES[h],
      place: PLACES[p],
      item: ITEMS[i],
      encounter: ENCOUNTERS[e],
      ending: ENDINGS[en],
    });
  }

  function handleMake() {
    generate({ hero, place, item, encounter, ending });
  }

  function handleSaveFavorite() {
    if (!story || savedThis) return;
    setSave((prev) => ({ ...prev, favorites: [story, ...prev.favorites] }));
    setSavedThis(true);
  }

  function handleDeleteFavorite(id: string) {
    setSave((prev) => ({
      ...prev,
      favorites: prev.favorites.filter((f) => f.id !== id),
    }));
    if (viewing && viewing.id === id) setViewing(null);
  }

  const shownStory = view === "favorites" ? viewing : story;

  return (
    <div className="page">
      <header className="header">
        <div className="header-deco" aria-hidden="true">
          🎃 👻 🦇 🌙 ⭐
        </div>
        <h1>ハロウィンおはなしメーカー</h1>
        <p className="subtitle">
          すきな ものを えらんで、やさしい おはなしを つくろう！
        </p>
        <p className="counts">
          つくった おはなし： {save.total}こ ／ おきにいり：{" "}
          {save.favorites.length}こ
        </p>
      </header>

      {view === "select" && (
        <main>
          <section className="card">
            <h2>🎲 ぜんぶ ランダムも できるよ</h2>
            <button type="button" className="big-btn random" onClick={handleRandom}>
              🎲 ランダムで つくる
            </button>
            <p className="hint">
              下から ひとつずつ えらんで つくることも できるよ。
            </p>
          </section>

          <CategorySection
            title="しゅじんこう"
            emoji="👻"
            options={HEROES.map((h) => ({ emoji: h.emoji, label: h.label }))}
            selected={heroIdx}
            onSelect={setHeroIdx}
          />
          <CategorySection
            title="ばしょ"
            emoji="🏚️"
            options={PLACES.map((p) => ({ emoji: p.emoji, label: p.label }))}
            selected={placeIdx}
            onSelect={setPlaceIdx}
          />
          <CategorySection
            title="アイテム"
            emoji="🏮"
            options={ITEMS.map((i) => ({ emoji: i.emoji, label: i.label }))}
            selected={itemIdx}
            onSelect={setItemIdx}
          />
          <CategorySection
            title="であう あいて"
            emoji="🧙‍♀️"
            options={ENCOUNTERS.map((e) => ({
              emoji: e.emoji,
              label: e.label,
            }))}
            selected={encIdx}
            onSelect={setEncIdx}
          />
          <CategorySection
            title="おわり"
            emoji="🍬"
            options={ENDINGS.map((e) => ({ emoji: e.emoji, label: e.label }))}
            selected={endIdx}
            onSelect={setEndIdx}
          />

          <section className="card">
            <button type="button" className="big-btn make" onClick={handleMake}>
              📖 おはなしを つくる
            </button>
            <button
              type="button"
              className="big-btn sub"
              onClick={() => {
                setViewing(null);
                setView("favorites");
              }}
            >
              ❤️ おきにいりを みる（{save.favorites.length}こ）
            </button>
          </section>
        </main>
      )}

      {(view === "story" || (view === "favorites" && shownStory)) &&
        shownStory && (
          <main>
            <article className="card story-card">
              <div className="story-emojis" aria-hidden="true">
                {shownStory.emojis}
              </div>
              <h2 className="story-title">『{shownStory.title}』</h2>
              <div className="story-body">
                {shownStory.sentences.map((s, i) => (
                  <p key={i}>{s}</p>
                ))}
              </div>
              {canSpeak && (
                <button
                  type="button"
                  className="big-btn speak"
                  onClick={() =>
                    speak(`${shownStory.title}。${shownStory.sentences.join("")}`)
                  }
                >
                  🔊 よんで もらう
                </button>
              )}
              {view === "story" && (
                <button
                  type="button"
                  className="big-btn fav"
                  onClick={handleSaveFavorite}
                  disabled={savedThis}
                >
                  {savedThis ? "✅ ほぞんしたよ！" : "❤️ おきにいりに ほぞん"}
                </button>
              )}
            </article>

            <section className="card">
              {view === "story" && (
                <button
                  type="button"
                  className="big-btn random"
                  onClick={handleRandom}
                >
                  🎲 もうひとつ ランダムで つくる
                </button>
              )}
              <button
                type="button"
                className="big-btn sub"
                onClick={() => setView("select")}
              >
                ⬅️ えらぶ画面に もどる
              </button>
              <button
                type="button"
                className="big-btn sub"
                onClick={() => {
                  setViewing(null);
                  setView("favorites");
                }}
              >
                ❤️ おきにいりを みる（{save.favorites.length}こ）
              </button>
            </section>
          </main>
        )}

      {view === "favorites" && !viewing && (
        <main>
          <section className="card">
            <h2>❤️ おきにいりの おはなし</h2>
            {save.favorites.length === 0 ? (
              <p className="hint">
                まだ ほぞんした おはなしは ないよ。おはなしを つくって、
                「おきにいりに ほぞん」を おしてね。
              </p>
            ) : (
              <ul className="fav-list">
                {save.favorites.map((f) => (
                  <li key={f.id} className="fav-item">
                    <div className="fav-info">
                      <span className="fav-emojis" aria-hidden="true">
                        {f.emojis}
                      </span>
                      <span className="fav-title">『{f.title}』</span>
                    </div>
                    <div className="fav-actions">
                      <button
                        type="button"
                        className="small-btn"
                        onClick={() => setViewing(f)}
                      >
                        📖 みる
                      </button>
                      <button
                        type="button"
                        className="small-btn danger"
                        onClick={() => handleDeleteFavorite(f.id)}
                      >
                        🗑️ けす
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              className="big-btn sub"
              onClick={() => setView("select")}
            >
              ⬅️ えらぶ画面に もどる
            </button>
          </section>
        </main>
      )}

      <footer className="footer">
        こわくない、やさしい ハロウィンの おはなしだけだよ 🎃
      </footer>
    </div>
  );
}

/* ---------- カテゴリ選択セクション ---------- */

interface CategorySectionProps {
  title: string;
  emoji: string;
  options: { emoji: string; label: string }[];
  selected: number;
  onSelect: (idx: number) => void;
}

function CategorySection({
  title,
  emoji,
  options,
  selected,
  onSelect,
}: CategorySectionProps) {
  return (
    <section className="card">
      <h2>
        {emoji} {title}
      </h2>
      <div className="option-grid">
        {options.map((opt, i) => (
          <button
            key={opt.label}
            type="button"
            className={`option-btn${i === selected ? " selected" : ""}`}
            onClick={() => onSelect(i)}
            aria-pressed={i === selected}
          >
            <span className="option-emoji" aria-hidden="true">
              {opt.emoji}
            </span>
            <span className="option-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
