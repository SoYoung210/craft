import SplitType, { SplitTypeOptions, TargetElement } from 'split-type';

export function splitText(target: TargetElement, options?: SplitTypeOptions) {
  const splitType = SplitType.create(target, options);

  return {
    lines: splitType.lines,
    word: splitType.words,
    chars: splitType.chars,
    revert: splitType.revert,
  };
}
