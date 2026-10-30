/* oxlint-disable react/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Language = 'pt' | 'en' | 'es';
type Params = Record<string, string | number>;

const messages = {
  pt: {
    explore: 'Explorar',
    activities: 'Atividades',
    players: 'Jogadores',
    profile: 'Perfil',
    contact: 'Entre em contato',
    contactTitle: 'Olá, eu sou Lucas Cruz',
    contactIntroduction:
      'Sou desenvolvedor full-stack com mais de quatro anos de experiência criando produtos web de alta performance. Gosto de transformar ideias complexas em experiências simples, unindo arquitetura limpa, dados úteis e atenção ao design.',
    contactLearning:
      'Atualmente também estou expandindo meus conhecimentos em ciência de dados e machine learning, sempre aprendendo, prototipando e entregando novos projetos.',
    portfolioTitle: 'Conheça meu trabalho',
    portfolioDescription:
      'Veja meus projetos selecionados, experiências e as tecnologias que uso para construir produtos digitais.',
    visitPortfolio: 'Visitar portfólio',
    letsTalk: 'Vamos conversar',
    contactInvitation:
      'Tem um projeto, uma oportunidade ou quer trocar uma ideia? Entre em contato comigo por um dos canais abaixo.',
    gameDetails: 'Detalhes do jogo',
    mainMenu: 'Menu principal',
    mainNav: 'Principal',
    mobileNav: 'Principal para dispositivos móveis',
    showSidebar: 'Mostrar menu lateral',
    hideSidebar: 'Guardar menu lateral',
    blocksUsed: '05 / 16 blocos usados',
    providedBy: 'GameTrack // Dados fornecidos por',
    language: 'Idioma',
    portuguese: 'Português',
    english: 'English',
    spanish: 'Español',
    loading: 'Carregando…',
    retry: 'Tentar novamente',
    previous: 'Anterior',
    next: 'Próxima',
    pageOf: 'Página {page} de {total}',
    pagination: 'Paginação',
    searchGames: 'Buscar jogos',
    searchPlaceholder: 'Buscar jogos, ex.: Hollow Knight',
    search: 'Buscar',
    sortBy: 'Ordenar por',
    sortRelevance: 'Relevância',
    sortPopularity: 'Popularidade',
    sortAverageRating: 'Nota média',
    sortName: 'Nome',
    sortReleaseDate: 'Data de lançamento',
    genre: 'Gênero',
    allGenres: 'Todos os gêneros',
    ascending: 'Crescente',
    descending: 'Decrescente',
    sortAscending: 'Ordenado do menor para o maior',
    sortDescending: 'Ordenado do maior para o menor',
    relevanceDirectionUnavailable:
      'O RAWG não oferece direção inversa para relevância',
    journey: 'Registre sua jornada nos games',
    journeyDescription:
      'Organize sua biblioteca, acompanhe seu progresso e descubra seu próximo jogo.',
    resultsFor: 'Resultados para “{search}”',
    updatingGames: 'Atualizando jogos…',
    searchingGames: 'Buscando jogos…',
    gamesLoadError: 'Não foi possível carregar os jogos',
    noGames: 'Nenhum jogo encontrado',
    tryAnotherName: 'Tente buscar por outro nome.',
    gameLoading: 'Carregando jogo…',
    gameNotFound: 'Jogo não encontrado',
    gameNotFoundDescription:
      'Ele pode ter sido removido ou o link está incorreto.',
    gameLoadError: 'Não foi possível carregar o jogo',
    release: 'Lançamento',
    noReviews: 'Ainda sem avaliações.',
    averageRating: 'Nota média',
    averageAria: 'Nota média de {stars} estrelas em {count} avaliações',
    oneReview: 'avaliação da comunidade',
    manyReviews: 'avaliações da comunidade',
    genres: 'Gêneros',
    platforms: 'Plataformas',
    about: 'Sobre',
    noDescription: 'Sem descrição disponível.',
    loginTitle: 'Sua biblioteca de jogos',
    loginDescription:
      'Organize o que você está jogando, acompanhe seu progresso e avalie o que já terminou.',
    activateDark: 'Ativar tema escuro PS2',
    activateLight: 'Ativar tema claro PS1',
    currentLight: 'Tema atual: claro PS1',
    currentDark: 'Tema atual: escuro PS2',
  },
  en: {
    explore: 'Explore',
    activities: 'Activity',
    players: 'Players',
    profile: 'Profile',
    contact: 'Contact',
    contactTitle: "Hi, I'm Lucas Cruz",
    contactIntroduction:
      'I am a full-stack developer with over four years of experience building high-performance web products. I turn complex ideas into simple experiences by combining clean architecture, useful data, and strong visual thinking.',
    contactLearning:
      'I am currently expanding into data science and machine learning, always learning, prototyping, and shipping new projects.',
    portfolioTitle: 'Explore my work',
    portfolioDescription:
      'See my selected projects, experiments, and the technologies I use to build digital products.',
    visitPortfolio: 'Visit portfolio',
    letsTalk: "Let's talk",
    contactInvitation:
      'Have a project, an opportunity, or simply want to connect? Reach me through one of the channels below.',
    gameDetails: 'Game details',
    mainMenu: 'Main menu',
    mainNav: 'Main',
    mobileNav: 'Main navigation for mobile devices',
    showSidebar: 'Show sidebar',
    hideSidebar: 'Hide sidebar',
    blocksUsed: '05 / 16 blocks used',
    providedBy: 'GameTrack // Data provided by',
    language: 'Language',
    portuguese: 'Português',
    english: 'English',
    spanish: 'Español',
    loading: 'Loading…',
    retry: 'Try again',
    previous: 'Previous',
    next: 'Next',
    pageOf: 'Page {page} of {total}',
    pagination: 'Pagination',
    searchGames: 'Search games',
    searchPlaceholder: 'Search games, e.g. Hollow Knight',
    search: 'Search',
    sortBy: 'Sort by',
    sortRelevance: 'Relevance',
    sortPopularity: 'Popularity',
    sortAverageRating: 'Average rating',
    sortName: 'Name',
    sortReleaseDate: 'Release date',
    genre: 'Genre',
    allGenres: 'All genres',
    ascending: 'Ascending',
    descending: 'Descending',
    sortAscending: 'Sorted from lowest to highest',
    sortDescending: 'Sorted from highest to lowest',
    relevanceDirectionUnavailable:
      'RAWG does not provide reverse relevance ordering',
    journey: 'Track your gaming journey',
    journeyDescription:
      'Organize your library, track your progress, and discover your next game.',
    resultsFor: 'Results for “{search}”',
    updatingGames: 'Updating games…',
    searchingGames: 'Searching games…',
    gamesLoadError: 'Could not load games',
    noGames: 'No games found',
    tryAnotherName: 'Try searching for another name.',
    gameLoading: 'Loading game…',
    gameNotFound: 'Game not found',
    gameNotFoundDescription:
      'It may have been removed or the link is incorrect.',
    gameLoadError: 'Could not load the game',
    release: 'Release date',
    noReviews: 'No reviews yet.',
    averageRating: 'Average rating',
    averageAria: 'Average rating of {stars} stars from {count} reviews',
    oneReview: 'community review',
    manyReviews: 'community reviews',
    genres: 'Genres',
    platforms: 'Platforms',
    about: 'About',
    noDescription: 'No description available.',
    loginTitle: 'Your game library',
    loginDescription:
      'Organize what you are playing, track your progress, and review what you have finished.',
    activateDark: 'Enable dark PS2 theme',
    activateLight: 'Enable light PS1 theme',
    currentLight: 'Current theme: light PS1',
    currentDark: 'Current theme: dark PS2',
  },
  es: {
    explore: 'Explorar',
    activities: 'Actividad',
    players: 'Jugadores',
    profile: 'Perfil',
    contact: 'Contacto',
    contactTitle: 'Hola, soy Lucas Cruz',
    contactIntroduction:
      'Soy desarrollador full-stack con más de cuatro años de experiencia creando productos web de alto rendimiento. Transformo ideas complejas en experiencias simples combinando arquitectura limpia, datos útiles y atención al diseño.',
    contactLearning:
      'Actualmente también estoy ampliando mis conocimientos en ciencia de datos y machine learning, siempre aprendiendo, creando prototipos y publicando nuevos proyectos.',
    portfolioTitle: 'Conoce mi trabajo',
    portfolioDescription:
      'Descubre mis proyectos seleccionados, experimentos y las tecnologías que utilizo para crear productos digitales.',
    visitPortfolio: 'Visitar portafolio',
    letsTalk: 'Hablemos',
    contactInvitation:
      '¿Tienes un proyecto, una oportunidad o simplemente quieres conversar? Contáctame por uno de los canales disponibles.',
    gameDetails: 'Detalles del juego',
    mainMenu: 'Menú principal',
    mainNav: 'Principal',
    mobileNav: 'Navegación principal para móviles',
    showSidebar: 'Mostrar menú lateral',
    hideSidebar: 'Ocultar menú lateral',
    blocksUsed: '05 / 16 bloques usados',
    providedBy: 'GameTrack // Datos proporcionados por',
    language: 'Idioma',
    portuguese: 'Português',
    english: 'English',
    spanish: 'Español',
    loading: 'Cargando…',
    retry: 'Intentar de nuevo',
    previous: 'Anterior',
    next: 'Siguiente',
    pageOf: 'Página {page} de {total}',
    pagination: 'Paginación',
    searchGames: 'Buscar juegos',
    searchPlaceholder: 'Buscar juegos, ej.: Hollow Knight',
    search: 'Buscar',
    sortBy: 'Ordenar por',
    sortRelevance: 'Relevancia',
    sortPopularity: 'Popularidad',
    sortAverageRating: 'Nota media',
    sortName: 'Nombre',
    sortReleaseDate: 'Fecha de lanzamiento',
    genre: 'Género',
    allGenres: 'Todos los géneros',
    ascending: 'Ascendente',
    descending: 'Descendente',
    sortAscending: 'Ordenado de menor a mayor',
    sortDescending: 'Ordenado de mayor a menor',
    relevanceDirectionUnavailable:
      'RAWG no ofrece orden inverso por relevancia',
    journey: 'Registra tu recorrido en los videojuegos',
    journeyDescription:
      'Organiza tu biblioteca, sigue tu progreso y descubre tu próximo juego.',
    resultsFor: 'Resultados para “{search}”',
    updatingGames: 'Actualizando juegos…',
    searchingGames: 'Buscando juegos…',
    gamesLoadError: 'No se pudieron cargar los juegos',
    noGames: 'No se encontraron juegos',
    tryAnotherName: 'Prueba buscar otro nombre.',
    gameLoading: 'Cargando juego…',
    gameNotFound: 'Juego no encontrado',
    gameNotFoundDescription:
      'Puede haber sido eliminado o el enlace es incorrecto.',
    gameLoadError: 'No se pudo cargar el juego',
    release: 'Lanzamiento',
    noReviews: 'Todavía no hay reseñas.',
    averageRating: 'Nota media',
    averageAria: 'Nota media de {stars} estrellas en {count} reseñas',
    oneReview: 'reseña de la comunidad',
    manyReviews: 'reseñas de la comunidad',
    genres: 'Géneros',
    platforms: 'Plataformas',
    about: 'Acerca de',
    noDescription: 'Sin descripción disponible.',
    loginTitle: 'Tu biblioteca de juegos',
    loginDescription:
      'Organiza lo que estás jugando, sigue tu progreso y valora lo que ya terminaste.',
    activateDark: 'Activar tema oscuro PS2',
    activateLight: 'Activar tema claro PS1',
    currentLight: 'Tema actual: claro PS1',
    currentDark: 'Tema actual: oscuro PS2',
  },
} as const;

export type TranslationKey = keyof typeof messages.pt;
const I18nContext = createContext<null | {
  language: Language;
  locale: string;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Params) => string;
}>(null);
const STORAGE_KEY = 'gametrack-language';

function initialLanguage(): Language {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    /* Use system language. */
  }
  if (saved === 'pt' || saved === 'en' || saved === 'es') return saved;
  for (const locale of navigator.languages) {
    const language = locale.toLowerCase().split('-')[0];
    if (language === 'pt' || language === 'en' || language === 'es')
      return language;
  }
  return 'pt';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const value = useMemo(
    () => ({
      language,
      locale:
        language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES',
      setLanguage(next: Language) {
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* Selection still applies. */
        }
        setLanguageState(next);
      },
      t(key: TranslationKey, params: Params = {}) {
        return Object.entries(params).reduce(
          (text, [name, replacement]) =>
            text.replaceAll(`{${name}}`, String(replacement)),
          messages[language][key] as string,
        );
      },
    }),
    [language],
  );
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
