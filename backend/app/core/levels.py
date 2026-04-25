"""Level calculation utility for CodeLingo XP system."""

from __future__ import annotations

from dataclasses import dataclass

# XP required to *reach* each level (cumulative totals).
# Level 1 starts at 0 XP.
_LEVEL_THRESHOLDS: list[int] = [
    0,    # Level 1
    100,  # Level 2
    250,  # Level 3
    500,  # Level 4
    1000, # Level 5
    1750, # Level 6
    2750, # Level 7
    4000, # Level 8
    5500, # Level 9
    7500, # Level 10
]

_LEVEL_NAMES: list[str] = [
    "Newcomer",
    "Apprentice",
    "Coder",
    "Developer",
    "Engineer",
    "Senior Dev",
    "Tech Lead",
    "Architect",
    "Principal",
    "Grandmaster",
]


@dataclass(slots=True)
class LevelInfo:
    level: int
    level_name: str
    xp_current: int          # XP the user actually has
    xp_for_current_level: int  # XP threshold for this level
    xp_for_next_level: int | None  # XP needed to reach next level (None at max)
    xp_to_next_level: int | None  # How many XP still needed (None at max)


def get_level_info(xp: int) -> LevelInfo:
    """Return full level information for a given XP value."""
    xp = max(0, xp)

    level = 1
    for i, threshold in enumerate(_LEVEL_THRESHOLDS):
        if xp >= threshold:
            level = i + 1
        else:
            break

    level_index = level - 1
    level_name = (
        _LEVEL_NAMES[level_index]
        if level_index < len(_LEVEL_NAMES)
        else f"Grandmaster {level - len(_LEVEL_NAMES) + 1}"
    )
    xp_for_current = _LEVEL_THRESHOLDS[level_index] if level_index < len(_LEVEL_THRESHOLDS) else 0

    if level < len(_LEVEL_THRESHOLDS):
        xp_for_next = _LEVEL_THRESHOLDS[level]  # level index = level-1, next = level
        xp_to_next = xp_for_next - xp
    else:
        xp_for_next = None
        xp_to_next = None

    return LevelInfo(
        level=level,
        level_name=level_name,
        xp_current=xp,
        xp_for_current_level=xp_for_current,
        xp_for_next_level=xp_for_next,
        xp_to_next_level=xp_to_next,
    )
