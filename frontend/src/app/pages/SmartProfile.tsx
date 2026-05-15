import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { GlassInput } from '../components/GlassInput';
import { SkillTag } from '../components/SkillTag';
import { AnimatedProgress } from '../components/AnimatedProgress';
import { Icons } from '../components/Icons';
import { apiFetch } from '../../services/api';
import { toast } from 'sonner';

interface SmartProfileProps {
  userName: string;
  onBack: () => void;
  onSave?: () => void;
}

interface EducationEntry {
  qualification: string;
  city: string;
  percentage: string;
}

interface ProfileState {
  fullName: string;
  email: string;
  age: string;
  location: string;
  phone: string;
  linkedin: string;
  skills: string[];
  interests: string[];
  preferences: string[];
  education: string;
  experience: string;
  skillLevel: string;
}

interface ApiProfilePayload {
  fullName?: string;
  email?: string;
  age?: number | string | null;
  location?: string;
  phone?: string;
  linkedin?: string;
  skills?: unknown;
  interests?: unknown;
  preferences?: unknown;
  education?: string;
  educationEntries?: unknown;
  experience?: string;
  skillLevel?: string;
}

const createEmptyEducationEntry = (): EducationEntry => ({
  qualification: '',
  city: '',
  percentage: '',
});

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item ?? '').trim())
    .filter((item) => item.length > 0);
};

const normalizeEducationEntries = (value: unknown): EducationEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      const typedEntry = entry as Record<string, unknown>;

      return {
        qualification: String(typedEntry.qualification ?? '').trim(),
        city: String(typedEntry.city ?? '').trim(),
        percentage: String(typedEntry.percentage ?? '').trim(),
      };
    })
    .filter((entry): entry is EducationEntry => Boolean(entry?.qualification || entry?.city || entry?.percentage));
};

export function SmartProfile({ userName, onBack, onSave }: SmartProfileProps) {
  const [profile, setProfile] = useState<ProfileState>({
    fullName: '',
    email: '',
    age: '',
    location: '',
    phone: '',
    linkedin: '',
    skills: [],
    interests: [],
    preferences: [],
    education: '',
    experience: '',
    skillLevel: '',
  });
  const [savedProfile, setSavedProfile] = useState<ProfileState>(profile);
  const [savedExperienceType, setSavedExperienceType] = useState<'experienced' | 'fresher'>('fresher');
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([]);
  const [savedEducationEntries, setSavedEducationEntries] = useState<EducationEntry[]>([]);
  const [educationDraft, setEducationDraft] = useState<EducationEntry>(createEmptyEducationEntry());
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'interests' | 'preferences' | 'education' | 'experience'>('basic');
  const [experienceType, setExperienceType] = useState<'experienced' | 'fresher'>('fresher');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await apiFetch<any>('/api/auth/me', { method: 'GET' }, { auth: true });
        const data = (response?.data ?? response?.user ?? response) as ApiProfilePayload;

        if (cancelled) {
          return;
        }

        const nextProfile: ProfileState = {
          fullName: String(data.fullName ?? ''),
          email: String(data.email ?? ''),
          age: data.age !== undefined && data.age !== null ? String(data.age) : '',
          location: String(data.location ?? ''),
          phone: String(data.phone ?? ''),
          linkedin: String(data.linkedin ?? ''),
          skills: normalizeStringArray(data.skills),
          interests: normalizeStringArray(data.interests),
          preferences: normalizeStringArray(data.preferences),
          education: String(data.education ?? ''),
          experience: String(data.experience ?? ''),
          skillLevel: String(data.skillLevel ?? ''),
        };

        const nextEducationEntries = normalizeEducationEntries(data.educationEntries);
        const nextExperienceType = (data.experienceType === 'experienced' || data.experienceType === 'fresher') 
          ? data.experienceType 
          : 'fresher';

        setProfile(nextProfile);
        setSavedProfile(nextProfile);
        setEducationEntries(nextEducationEntries);
        setSavedEducationEntries(nextEducationEntries);
        setExperienceType(nextExperienceType);
        setSavedExperienceType(nextExperienceType);
      } catch (loadError) {
        if (!cancelled) {
          const message = loadError instanceof Error ? loadError.message : 'Unable to load your profile.';
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const profileCompletion = (() => {
    const fields = [profile.fullName, profile.age, profile.location, profile.phone, profile.linkedin, profile.experience, profile.skillLevel];
    const filledFields = fields.filter((value) => value.trim().length > 0).length;
    const listScore = Math.min(profile.skills.length + profile.interests.length + profile.preferences.length + educationEntries.length, 12);
    const total = filledFields + listScore;

    return Math.min(100, Math.round((total / 19) * 100));
  })();

  const tabs = [
    { id: 'basic' as const, label: 'Basic Info', icon: <Icons.User /> },
    { id: 'skills' as const, label: 'Skills', icon: <Icons.Lightning /> },
    { id: 'interests' as const, label: 'Interests', icon: <Icons.Star /> },
    { id: 'preferences' as const, label: 'Preferences', icon: <Icons.Target /> },
    { id: 'education' as const, label: 'Education', icon: <Icons.Book /> },
    { id: 'experience' as const, label: 'Experience', icon: <Icons.Briefcase /> },
  ];

  const commitSkillInput = () => {
    const normalizedSkill = newSkill.trim().replace(/\s+/g, ' ');

    if (!normalizedSkill) {
      return;
    }

    setProfile((current) => {
      const nextSkills = [...current.skills];
      const existingSkillIndex = nextSkills.findIndex((skill) => skill.toLowerCase() === normalizedSkill.toLowerCase());

      if (existingSkillIndex !== -1) {
        nextSkills[existingSkillIndex] = normalizedSkill;
      } else {
        nextSkills.push(normalizedSkill);
      }

      return {
        ...current,
        skills: nextSkills,
      };
    });

    setNewSkill('');
  };

  const commitInterestInput = () => {
    const normalizedInterest = newInterest.trim().replace(/\s+/g, ' ');

    if (!normalizedInterest) {
      return;
    }

    setProfile((current) => {
      const nextInterests = [...current.interests];
      const existingInterestIndex = nextInterests.findIndex((interest) => interest.toLowerCase() === normalizedInterest.toLowerCase());

      if (existingInterestIndex !== -1) {
        nextInterests[existingInterestIndex] = normalizedInterest;
      } else {
        nextInterests.push(normalizedInterest);
      }

      return {
        ...current,
        interests: nextInterests,
      };
    });

    setNewInterest('');
  };

  const togglePreference = (preference: string) => {
    setProfile((current) => ({
      ...current,
      preferences: current.preferences.includes(preference)
        ? current.preferences.filter((existingPreference) => existingPreference !== preference)
        : [...current.preferences, preference],
    }));
  };

  const addEducationEntry = () => {
    const qualification = educationDraft.qualification.trim();
    const city = educationDraft.city.trim();
    const percentage = educationDraft.percentage.trim();

    if (!qualification || !city || !percentage) {
      setError('Please fill qualification, city, and percentage before adding.');
      return;
    }

    setEducationEntries((current) => [
      ...current,
      {
        qualification,
        city,
        percentage,
      },
    ]);
    setEducationDraft(createEmptyEducationEntry());
    setError('');
  };

  const removeEducationEntry = (index: number) => {
    setEducationEntries((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleResetProfile = () => {
    setProfile(savedProfile);
    setEducationEntries(savedEducationEntries);
    setEducationDraft(createEmptyEducationEntry());
    setExperienceType(savedExperienceType);
    setNewSkill('');
    setNewInterest('');
    setError('');
    setStatusMessage('');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError('');
    setStatusMessage('');

    const pendingSkill = newSkill.trim().replace(/\s+/g, ' ');
    const pendingInterest = newInterest.trim().replace(/\s+/g, ' ');

    const committedSkills = pendingSkill
      ? (() => {
          const nextSkills = [...profile.skills];
          const existingSkillIndex = nextSkills.findIndex((skill) => skill.toLowerCase() === pendingSkill.toLowerCase());

          if (existingSkillIndex !== -1) {
            nextSkills[existingSkillIndex] = pendingSkill;
            return nextSkills;
          }

          return [...nextSkills, pendingSkill];
        })()
      : profile.skills;

    const committedInterests = pendingInterest
      ? (() => {
          const nextInterests = [...profile.interests];
          const existingInterestIndex = nextInterests.findIndex((interest) => interest.toLowerCase() === pendingInterest.toLowerCase());

          if (existingInterestIndex !== -1) {
            nextInterests[existingInterestIndex] = pendingInterest;
            return nextInterests;
          }

          return [...nextInterests, pendingInterest];
        })()
      : profile.interests;

    const committedEducationEntries = educationEntries
      .map((entry) => ({
        qualification: entry.qualification.trim(),
        city: entry.city.trim(),
        percentage: entry.percentage.trim(),
      }))
      .filter((entry) => entry.qualification || entry.city || entry.percentage);

    try {
      const payload = {
        fullName: profile.fullName.trim() || undefined,
        age: profile.age.trim() ? Number(profile.age) : undefined,
        location: profile.location.trim() || undefined,
        phone: profile.phone.trim() || undefined,
        linkedin: profile.linkedin.trim() || undefined,
        skills: committedSkills,
        interests: committedInterests,
        preferences: profile.preferences,
        educationEntries: committedEducationEntries,
        experience: profile.experience.trim() || undefined,
        experienceType: experienceType,
        education: committedEducationEntries.length > 0
          ? committedEducationEntries.map((entry) => entry.qualification).join(' | ')
          : profile.education.trim() || undefined,
        skillLevel: profile.skillLevel.trim() || undefined,
      };

      const response = await apiFetch<any>('/api/auth/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }, { auth: true });

      const data = response?.data ?? response ?? {};

      const nextProfile: ProfileState = {
        fullName: String(data.fullName ?? profile.fullName),
        email: String(data.email ?? profile.email),
        age: data.age !== undefined && data.age !== null ? String(data.age) : profile.age,
        location: String(data.location ?? profile.location),
        phone: String(data.phone ?? profile.phone),
        linkedin: String(data.linkedin ?? profile.linkedin),
        skills: normalizeStringArray(data.skills).length > 0 ? normalizeStringArray(data.skills) : committedSkills,
        interests: normalizeStringArray(data.interests).length > 0 ? normalizeStringArray(data.interests) : committedInterests,
        preferences: normalizeStringArray(data.preferences).length > 0 ? normalizeStringArray(data.preferences) : profile.preferences,
        education: String(data.education ?? payload.education ?? profile.education),
        experience: String(data.experience ?? profile.experience),
        skillLevel: String(data.skillLevel ?? profile.skillLevel),
      };

      const savedEntries = normalizeEducationEntries(data.educationEntries);
      const nextEducationEntries = savedEntries.length > 0 ? savedEntries : committedEducationEntries;
      const nextExperienceType = (data.experienceType === 'experienced' || data.experienceType === 'fresher') 
        ? data.experienceType 
        : experienceType;

      setProfile(nextProfile);
      setSavedProfile(nextProfile);
      setEducationEntries(nextEducationEntries);
      setSavedEducationEntries(nextEducationEntries);
      setExperienceType(nextExperienceType);
      setSavedExperienceType(nextExperienceType);
      setEducationDraft(createEmptyEducationEntry());
      setNewSkill('');
      setNewInterest('');
      setStatusMessage('Profile saved successfully.');
      toast.success('Profile saved successfully!');

      if (onSave) {
        onSave();
      }
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Unable to save your profile right now.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSkillsSection = () => (
    <GlassCard strong className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">Skills</span>
            Skill Library
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl">Add your skills as plain text. Anything you type gets saved to your profile.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <GlassInput
            label="Add a skill"
            value={newSkill}
            onChange={(event) => setNewSkill(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitSkillInput();
              }
            }}
            placeholder="Type a skill and press Enter"
          />
          <div className="md:self-end">
            <GlassButton type="button" onClick={commitSkillInput}>Add Skill</GlassButton>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {profile.skills.length > 0 ? profile.skills.map((skill, index) => (
            <SkillTag key={`${skill}-${index}`} variant="primary" onRemove={() => setProfile((current) => ({ ...current, skills: current.skills.filter((_, currentIndex) => currentIndex !== index) }))}>
              {skill}
            </SkillTag>
          )) : <p className="text-sm text-gray-500">No skills added yet.</p>}
        </div>
      </div>
    </GlassCard>
  );

  const renderInterestsSection = () => (
    <GlassCard strong className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">Interests</span>
            Personal Interests
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl">Type any interest you want. The text is stored exactly the way you enter it.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <GlassInput
            label="Add an interest"
            value={newInterest}
            onChange={(event) => setNewInterest(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitInterestInput();
              }
            }}
            placeholder="Type an interest and press Enter"
          />
          <div className="md:self-end">
            <GlassButton type="button" onClick={commitInterestInput}>Add Interest</GlassButton>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {profile.interests.length > 0 ? profile.interests.map((interest, index) => (
            <SkillTag key={`${interest}-${index}`} onRemove={() => setProfile((current) => ({ ...current, interests: current.interests.filter((_, currentIndex) => currentIndex !== index) }))}>
              {interest}
            </SkillTag>
          )) : <p className="text-sm text-gray-500">No interests added yet.</p>}
        </div>
      </div>
    </GlassCard>
  );

  const renderPreferencesSection = () => {
    const preferenceGroups = [
      {
        title: 'Work Environment',
        subtitle: 'Pick what fits your routine',
        options: [
          { value: 'Indoor', icon: 'Indoor', desc: 'Office-based work with a structured setup' },
          { value: 'Outdoor', icon: 'Outdoor', desc: 'Field-based work and active environments' },
        ],
      },
      {
        title: 'Work Style',
        subtitle: 'How you like to work',
        options: [
          { value: 'Desk Job', icon: 'Desk Job', desc: 'Computer-focused work and deep concentration' },
          { value: 'Field Job', icon: 'Field Job', desc: 'Active, mobile work with movement' },
        ],
      },
      {
        title: 'Priority',
        subtitle: 'What matters most right now',
        options: [
          { value: 'Salary', icon: 'Salary', desc: 'Financial growth and stable income' },
          { value: 'Passion', icon: 'Passion', desc: 'Work you genuinely enjoy doing' },
        ],
      },
    ];

    return (
      <GlassCard strong className="p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">Preferences</span>
              Work Preferences
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-2xl">Choose one or more preferences and save them to your profile.</p>
          </div>
        </div>

        <div className="space-y-8">
          {preferenceGroups.map((group) => (
            <div key={group.title}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">{group.title}</label>
                  <span className="text-xs text-gray-500">{group.subtitle}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.options.map((option) => {
                  const selected = profile.preferences.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => togglePreference(option.value)}
                      className={`group rounded-2xl border p-5 text-left transition-all duration-200 ${selected ? 'border-indigo-400 bg-gradient-to-br from-indigo-500/30 to-violet-500/20 shadow-[0_0_0_1px_rgba(129,140,248,0.35)]' : 'border-white/10 bg-white/[0.03] hover:border-indigo-400/40 hover:bg-white/[0.05]'}`}
                    >
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-sm font-semibold text-indigo-200">
                        {option.icon}
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-white">{option.value}</div>
                          <div className="mt-1 text-sm text-gray-400">{option.desc}</div>
                        </div>
                        <span className={`text-xs font-semibold ${selected ? 'text-indigo-200' : 'text-gray-500'}`}>{selected ? 'Selected' : 'Tap to choose'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    );
  };

  const renderEducationSection = () => (
    <GlassCard strong className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">Education</span>
            Education History
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl">Add every qualification one by one with city and percentage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-4">
        <GlassInput
          label="Qualification"
          value={educationDraft.qualification}
          onChange={(event) => setEducationDraft((current) => ({ ...current, qualification: event.target.value }))}
          placeholder="10th Pass, 12th Pass, B.Tech, etc."
        />
        <GlassInput
          label="City"
          value={educationDraft.city}
          onChange={(event) => setEducationDraft((current) => ({ ...current, city: event.target.value }))}
          placeholder="City"
        />
        <GlassInput
          label="Percentage"
          value={educationDraft.percentage}
          onChange={(event) => setEducationDraft((current) => ({ ...current, percentage: event.target.value }))}
          placeholder="78%"
        />
      </div>

      <div className="flex gap-3 mb-6">
        <GlassButton type="button" onClick={addEducationEntry}>Add Qualification</GlassButton>
        <GlassButton type="button" variant="ghost" onClick={() => setEducationDraft(createEmptyEducationEntry())}>Clear Draft</GlassButton>
      </div>

      <div className="space-y-3">
        {educationEntries.length > 0 ? educationEntries.map((entry, index) => (
          <div key={`${entry.qualification}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold text-white">{entry.qualification}</div>
              <div className="text-sm text-gray-400">{entry.city} | {entry.percentage}</div>
            </div>
            <GlassButton type="button" variant="ghost" onClick={() => removeEducationEntry(index)}>Remove</GlassButton>
          </div>
        )) : (
          <p className="text-sm text-gray-500">No education entries added yet.</p>
        )}
      </div>
    </GlassCard>
  );

  const renderExperienceSection = () => (
    <GlassCard strong className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">Experience</span>
            Experience and Goals
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl">Tell us about your professional background and career goals.</p>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="text-sm font-semibold text-gray-300 mb-3">Are you an experienced professional or a fresher?</div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setExperienceType('fresher')}
            className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
              experienceType === 'fresher'
                ? 'border-indigo-400 bg-indigo-500/20 text-indigo-100'
                : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
            }`}
          >
            👨‍🎓 Fresher
          </button>
          <button
            onClick={() => setExperienceType('experienced')}
            className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
              experienceType === 'experienced'
                ? 'border-indigo-400 bg-indigo-500/20 text-indigo-100'
                : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
            }`}
          >
            💼 Experienced
          </button>
        </div>
        {experienceType === 'fresher' && (
          <div className="rounded-2xl border border-green-400/30 bg-green-500/10 p-4 text-sm text-green-200">
            ✓ You'll be marked as a fresher. You can update this anytime when you gain experience.
          </div>
        )}
      </div>

      {experienceType === 'experienced' && (
        <div className="space-y-4">
          <GlassInput
            label="Full Name"
            value={profile.fullName}
            onChange={(event) => setProfile((current) => ({ ...current, fullName: event.target.value }))}
            placeholder="Your full name"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput
              label="Age"
              value={profile.age}
              onChange={(event) => setProfile((current) => ({ ...current, age: event.target.value }))}
              placeholder="18"
              inputMode="numeric"
            />
            <GlassInput
              label="Skill Level"
              value={profile.skillLevel}
              onChange={(event) => setProfile((current) => ({ ...current, skillLevel: event.target.value }))}
              placeholder="Beginner, Intermediate, Advanced"
            />
          </div>
          <GlassInput
            label="Location"
            value={profile.location}
            onChange={(event) => setProfile((current) => ({ ...current, location: event.target.value }))}
            placeholder="City, State"
          />
          <GlassInput
            label="Phone"
            value={profile.phone}
            onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
            placeholder="Phone number"
          />
          <GlassInput
            label="LinkedIn"
            value={profile.linkedin}
            onChange={(event) => setProfile((current) => ({ ...current, linkedin: event.target.value }))}
            placeholder="linkedin.com/in/username"
          />
          <div>
            <label className="block mb-2 text-gray-200 text-sm font-medium">Experience</label>
            <textarea
              rows={8}
              value={profile.experience}
              onChange={(event) => setProfile((current) => ({ ...current, experience: event.target.value }))}
              placeholder="Summarize your work experience, internships, projects, or goals."
              className="w-full px-4 py-3 glass rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>
      )}
    </GlassCard>
  );

  const renderBasicSection = () => (
    <GlassCard strong className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">Profile</span>
            Basic Information
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl">Update the core profile details that appear across the app.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput
          label="Full Name"
          value={profile.fullName}
          onChange={(event) => setProfile((current) => ({ ...current, fullName: event.target.value }))}
          placeholder={userName}
        />
        <GlassInput
          label="Email"
          value={profile.email}
          onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
          placeholder="Email address"
        />
        <GlassInput
          label="Age"
          value={profile.age}
          onChange={(event) => setProfile((current) => ({ ...current, age: event.target.value }))}
          placeholder="Age"
          inputMode="numeric"
        />
        <GlassInput
          label="Location"
          value={profile.location}
          onChange={(event) => setProfile((current) => ({ ...current, location: event.target.value }))}
          placeholder="City, State"
        />
      </div>
    </GlassCard>
  );

  return (
    <div className="min-h-screen">
      <nav className="glass-strong border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Icons.User />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Smart Profile</div>
              <div className="text-xs text-gray-400">{profileCompletion}% Complete</div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1">
            <GlassCard strong className="p-4 h-fit">
              <div className="text-center mb-3">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
                  {(profile.fullName || userName).charAt(0).toUpperCase()}
                </div>
                <h2 className="text-sm font-bold text-white mb-0.5">{profile.fullName || userName}</h2>
                <p className="text-xs text-gray-400">Student</p>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Profile Strength</span>
                  <span className="text-sm font-semibold text-indigo-400">{profileCompletion}%</span>
                </div>
                <AnimatedProgress value={profileCompletion} color="primary" showLabel={false} />
              </div>

              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm ${activeTab === tab.id ? 'gradient-primary text-white shadow-lg' : 'glass text-gray-400 hover:text-white'}`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span className="font-medium text-xs">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-3 glass rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icons.Sparkles />
                  <span className="text-xs font-semibold text-indigo-400">AI Suggestions</span>
                </div>
                <p className="text-xs text-gray-400">
                  {profile.skills.length < 8
                    ? `Add ${8 - profile.skills.length} more skills to strengthen your profile.`
                    : 'Your profile is shaping up well.'}
                </p>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {error && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {statusMessage && (
              <div className="rounded-2xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                {statusMessage}
              </div>
            )}

            {activeTab === 'basic' && renderBasicSection()}
            {activeTab === 'skills' && renderSkillsSection()}
            {activeTab === 'interests' && renderInterestsSection()}
            {activeTab === 'preferences' && renderPreferencesSection()}
            {activeTab === 'education' && renderEducationSection()}
            {activeTab === 'experience' && renderExperienceSection()}

            <GlassCard strong className="p-6">
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Save your profile</h3>
                  <p className="text-sm text-gray-400">All fields, custom skills, interests, and education entries will be stored.</p>
                </div>
                <div className="flex gap-3">
                  <GlassButton variant="ghost" type="button" onClick={handleResetProfile} disabled={isLoading || isSaving}>
                    Reset
                  </GlassButton>
                  <GlassButton variant="primary" type="button" onClick={handleSaveProfile} disabled={isLoading || isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}