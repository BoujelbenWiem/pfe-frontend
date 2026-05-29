## 🌍 Guide d'utilisation des traductions (i18n)

### Utilisation basique dans un composant

```tsx
"use client";

import { useLanguage } from "@/context/language/useLanguage";

export default function MyComponent() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div>
      {/* Afficher du texte traduit */}
      <h1>{t("auth.welcome")}</h1>
      <p>{t("auth.signInDesc")}</p>

      {/* Changer la langue */}
      <button onClick={() => setLanguage("en")}>English</button>
      <button onClick={() => setLanguage("fr")}>Français</button>

      {/* Accès direct à la langue courante */}
      <p>Langue actuelle: {language}</p>
    </div>
  );
}
```

### Structure des traductions

Les traductions sont organisées par domaine avec la notation "point" :
- `auth.welcome` - Domaine "auth", clé "welcome"
- `nav.chat` - Domaine "nav", clé "chat"
- `dashboard.title` - Domaine "dashboard", clé "title"

### Fichiers

📁 **Structures créées :**
- `src/context/language/types.ts` - Types TypeScript
- `src/context/language/LanguageProvider.tsx` - Provider (Context)
- `src/context/language/useLanguage.tsx` - Hook personnalisé
- `src/locales/fr.json` - Traductions français
- `src/locales/en.json` - Traductions anglais

### Ajouter une nouvelle traduction

1. Ouvrir `src/locales/fr.json`
2. Ajouter la paire clé-valeur :
   ```json
   {
     "myFeature.myKey": "Ma valeur en français"
   }
   ```
3. Ouvrir `src/locales/en.json`
4. Ajouter la traduction anglaise :
   ```json
   {
     "myFeature.myKey": "My value in English"
   }
   ```

### Exemple complet (AuthForm)

```tsx
import { useLanguage } from "@/context/language/useLanguage";

export default function AuthForm() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t("auth.welcome")}</h1>
      <label>{t("auth.email")}</label>
      <input placeholder={t("auth.email")} />
      <button>{t("auth.signInButton")}</button>
    </div>
  );
}
```

### Notes importantes

✅ **Le toggle langue est dans la Navbar** (🇬🇧 EN / 🇫🇷 FR)
✅ **La langue est sauvegardée dans localStorage**
✅ **Automatiquement hydraté au chargement de la page**
✅ **Fonctionne avec dark mode**

### Prochaines étapes

- Mettre à jour vos pages avec les traductions
- Ajouter plus de clés au fur et à mesure
- Tester avec le toggle dans la Navbar
