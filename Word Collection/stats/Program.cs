using System.Globalization;
using System.Text.RegularExpressions;
using CsvHelper;

internal class Program
{
    static Random _random = new();
    static void Main(string[] args)
    {
        // if the first command is 'write' then it will write files, else it will generate statements
        if (args.Length > 0 && args[0] == "write")
        {
            WriteFiles();
        }
        else
        {
            GenerateStatements();
        }
    }
    static void GenerateStatements()
    {
        // Testing random stat generation, and in different sentence forms to see which makes the most sense
        Console.WriteLine("Enter directory of csv files");
        string? directory = Console.ReadLine();
        if(directory == null) return;
        
        List<string> nouns = ReadCsv(Path.Join(directory, "Nouns.csv"));
        List<string> adjectives = ReadCsv(Path.Join(directory, "Adjectives.csv"));
        List<string> comparatives = ReadCsv(Path.Join(directory, "Comparatives.csv"));
        List<string> adverbs = ReadCsv(Path.Join(directory, "Adverbs.csv"));

        Console.WriteLine("How many stats?: ");
        string? input = Console.ReadLine();
        // Main input loop, continues until input is not there or amount is 0
        while (input != null && int.TryParse(input, out int statsAmount) && statsAmount != 0)
        {
            for (int i = 0; i < statsAmount; i++)
            {
                float randomPercentage = _random.Next(10000) / 100f;
                // Randomly decides which stats form to use
                switch (_random.Next(3))
                {
                    case 0:
                        Console.WriteLine($"{GetRandom(comparatives)} than {randomPercentage}% of {GetRandom(nouns)} are {GetRandom(adjectives)}");
                        break;
                    case 1:
                        Console.WriteLine($"{randomPercentage}% of {GetRandom(nouns)} are {GetRandom(adverbs)} {GetRandom(adjectives)}");
                        break;                    
                    case 2:
                        Console.WriteLine($"{GetRandom(comparatives)} than {randomPercentage}% of {GetRandom(nouns)} are {GetRandom(adverbs)} {GetRandom(adjectives)}");
                        break;
                }
            }
            
            Console.Write("How many stats?: ");
            input = Console.ReadLine();
        }
    }
    static void WriteFiles()
    {
        //Directory where all the csv's will be dumped
        Console.WriteLine("Enter output directory: ");
        string? outputDirectory = Console.ReadLine();
        if(outputDirectory == null) return;
        
        //The merged file contents of the corpus, annotated
        Console.WriteLine("Enter file contents: ");
        string? fileContentsPath = Console.ReadLine();
        if(fileContentsPath == null) return;
        string fileContents = File.ReadAllText(fileContentsPath);
        
        //Regex for matching word annotations split into groups, e.g. '<W NNP>December ' is a match
        Regex wordsRegex = new Regex(@"<W\s([a-zA-Z$]+)>([a-zA-Z-]+)\s");
        MatchCollection wordMatches = wordsRegex.Matches(fileContents);

        List<string> commonComparatives = GetCommonWords(wordMatches, new[] { "JJR" }, 0f).ToList();
        List<string> commonAdjectives = GetCommonWords(wordMatches, new[] {"JJ"}, 0.95f).ToList();
        
        List<string> commonAdverbs = GetCommonWords(wordMatches, new []{"RB"}, 0.7f).ToList();
        commonAdverbs.RemoveAll(adverb => !adverb.Contains("ly"));
        
        List<string> properNouns = GetCommonWords(wordMatches, new[] { "NNPS" }, 0f).ToList();
        List<string> nonProperNouns = GetCommonWords(wordMatches, new[] { "NNS" }, 0.7f).ToList();
        
        properNouns.AddRange(nonProperNouns);
        List<string> nouns = properNouns.Distinct().ToList();
        
        //I only used the Nouns.csv at the end product but it was helpful to have them to try out different stats formats
        WriteCsv(nouns, outputDirectory, "Nouns");
        WriteCsv(commonAdjectives, outputDirectory, "Adjectives");
        WriteCsv(commonComparatives, outputDirectory, "Comparatives");
        WriteCsv(commonAdverbs, outputDirectory, "Adverbs");
        Exit();
    }
    static T GetRandom<T>(List<T> list)
    {
        return list[_random.Next(list.Count)];
    }
    static List<string> ReadCsv(string directory)
    {
        using var reader = new StreamReader(directory);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        return csv.GetRecords<Record>().Select(record => record.Word).ToList();;
    }
    static void WriteCsv(IEnumerable<string> words, string directory, string csvName)
    {
        using var writer = new StreamWriter(Path.Join(directory, csvName + ".csv"));
        using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
        IEnumerable<Record> records = words.Select(word => new Record { Word = word });
        csv.WriteRecords(records);
    }
    static IEnumerable<string> GetCommonWords(MatchCollection wordMatches, string[] posTags, float percentileCutOff)
    {
        //Gets all words that match the parts of speech tags provided, these could be duplicate
        //in match of '<W NNP>December ', Groups[1] is 'NNP' (the pos) and Groups[2] is 'December ' (the word)
        List<string> duplicateWords = wordMatches.
            Where(match => posTags.Contains(match.Groups[1].Value)).
            Select(match => match.Groups[2].Value.Trim().ToLower()).ToList();
        
        //Go through all words and count their occurrences into a non-duplicate collection
        Dictionary<string, int> wordOccurrences = new();
        foreach (string word in duplicateWords)
        {
            if (wordOccurrences.ContainsKey(word))
            {
                wordOccurrences[word] += 1;
            }
            else
            {
                wordOccurrences.Add(word, 1);
            }
        }
        
        //sort the words so they can be cutoff by a % popularity
        var sortedWords = wordOccurrences
            .OrderByDescending(word => word.Value).ToList();
        
        //cut off words if they're not common enough
        int cutOffValue = sortedWords[(int)((1-percentileCutOff) * sortedWords.Count)-1].Value;
        IEnumerable<string> moreCommonWords = sortedWords.Where(pair => pair.Value > cutOffValue).Select(pair => pair.Key);
        
        return moreCommonWords;
    }
    static void Exit()
    {
        Console.WriteLine("Press enter to exit");
        Console.ReadLine();
    }
    class Record
    {
        public string Word { get; set; }
    }
    
}