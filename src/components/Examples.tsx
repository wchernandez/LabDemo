"use client";

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BookOpen } from 'lucide-react';

export interface Example {
  title: string;
  assignment: string;
  code: string;
  error: string;
  language: string;
}

const examples: Example[] = [
  {
    title: "Java Array Index Error",
    assignment: "Write a function that prints all elements in an array",
    code: `public class ArrayPrinter {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        for (int i = 0; i <= arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}`,
    error: "Exception in thread \"main\" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5",
    language: "java"
  },
  {
    title: "Python Type Error",
    assignment: "Calculate the average of a list of numbers",
    code: `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total = total + num
    return total / len(numbers)

result = calculate_average([10, 20, "30", 40])
print(result)`,
    error: "TypeError: unsupported operand type(s) for +: 'int' and 'str'",
    language: "python"
  },
  {
    title: "SQL Syntax Error",
    assignment: "Find all students with GPA above 3.5",
    code: `SELECT name, gpa
FROM students
WHERE gpa > 3.5
ORDER BY gpa DESC;`,
    error: "ERROR: syntax error at or near \";\"\nLINE 4: ORDER BY gpa DESC;\n                    ^",
    language: "sql"
  }
];

interface ExamplesProps {
  onSelectExample: (example: Example) => void;
}

export function Examples({ onSelectExample }: ExamplesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Example Problems</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {examples.map((example, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">{example.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {example.assignment}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onSelectExample(example)}
              >
                Load Example
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { examples };
